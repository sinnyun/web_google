import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const Cursor: React.FC = () => {
    const [cursorState, setCursorState] = useState<'default' | 'pointer' | 'drag'>('default');

    // Mouse position
    const mouseX = useMotionValue(-100);
    const mouseY = useMotionValue(-100);

    // Smooth spring animation for the outer circle (lag effect)
    const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
    const cursorX = useSpring(mouseX, springConfig);
    const cursorY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        const checkHover = (e: MouseEvent) => {
            const target = e.target as HTMLElement;

            // Check for drag targets first (higher priority)
            if (target.closest('[data-cursor="drag"]')) {
                setCursorState('drag');
                return;
            }

            // Check for pointer targets
            if (
                target.tagName.toLowerCase() === 'a' ||
                target.tagName.toLowerCase() === 'button' ||
                target.closest('a') ||
                target.closest('button') ||
                target.closest('[role="button"]')
            ) {
                setCursorState('pointer');
                return;
            }

            setCursorState('default');
        };

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mouseover', checkHover);
        window.addEventListener('mouseout', checkHover);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mouseover', checkHover);
            window.removeEventListener('mouseout', checkHover);
        };
    }, [mouseX, mouseY]);

    // Variants for the outer circle
    const outerVariants = {
        default: {
            width: 40,
            height: 40,
            backgroundColor: 'rgba(255, 255, 255, 0)',
            borderColor: 'rgba(255, 255, 255, 0.5)',
            borderWidth: 1,
            mixBlendMode: 'normal' as const,
        },
        pointer: {
            width: 60,
            height: 60,
            backgroundColor: '#dc2626', // red-600
            borderColor: '#dc2626',
            borderWidth: 0,
            opacity: 0.8,
            mixBlendMode: 'difference' as const,
        },
        drag: {
            width: 60,
            height: 60,
            backgroundColor: '#dc2626', // red-600
            borderColor: '#dc2626',
            borderWidth: 0,
            opacity: 0.8,
            mixBlendMode: 'difference' as const,
        }
    };

    // Variants for the inner dot
    const innerVariants = {
        default: {
            width: 6,
            height: 6,
            backgroundColor: '#ffffff',
            scale: 1,
        },
        pointer: {
            width: 12,
            height: 12,
            backgroundColor: '#ffffff',
            scale: 1.2,
        },
        drag: {
            width: 40, // Expand to fit arrows
            height: 20,
            backgroundColor: 'transparent',
            scale: 1,
        }
    };

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999] hidden md:block">
            {/* Outer Circle */}
            <motion.div
                className="absolute rounded-full flex items-center justify-center"
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
                variants={outerVariants}
                animate={cursorState}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            />

            {/* Inner Dot / Content */}
            <motion.div
                className="absolute rounded-full flex items-center justify-center"
                style={{
                    x: mouseX,
                    y: mouseY,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
                variants={innerVariants}
                animate={cursorState}
                transition={{ type: 'spring', stiffness: 500, damping: 28 }}
            >
                {cursorState === 'drag' && (
                    <motion.div
                        className="flex items-center gap-1 text-white"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <ArrowLeft size={12} strokeWidth={3} />
                        <ArrowRight size={12} strokeWidth={3} />
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default Cursor;
