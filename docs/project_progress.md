# Project Progress & Context

This document summarizes the modifications and current state of the project to facilitate understanding for future AI assistants.

## Project Overview
-   **Stack**: React + Vite + TypeScript
-   **Styling**: Tailwind CSS
-   **Animation**: Framer Motion
-   **Routing**: React Router DOM

## Recent Modifications

### 1. Project Cards (`Work.tsx`)
Focused on creating a premium, fluid interactive experience for the horizontal project list.

*   **Drag-to-Scroll**: Implemented custom drag logic with momentum/inertia.
*   **3D Tilt Effect**: Added a subtle 3D tilt to cards based on mouse position (range: +/- 5deg).
*   **Mouse Wheel Scrolling**:
    *   Mapped vertical wheel events to horizontal scroll.
    *   Implemented momentum scrolling for the wheel.
    *   Added **Directional Snapping**: Smart snapping that biases towards the scroll direction to prevent "bounce back" on small scrolls.
*   **Snapping**: Custom JavaScript-based snapping (replacing CSS scroll-snap) for smoother settling.

### 2. Homepage (`Home.tsx`)
Refined the visual presentation and added a complex loading sequence.

#### Visual & Interaction Improvements
*   **Transitions**:
    *   **No Flash**: Fixed white flashes between slides by adjusting opacity timings.
    *   **Parallax Cover**: Implemented a transition where the new slide slides *over* the exiting slide (which moves slightly in reverse), eliminating black gaps/borders.
    *   **Easing**: Changed to a slow `easeInOut` (1s duration) for a cinematic feel.
*   **Ken Burns Effect**: Active slide image slowly scales up (1.0 -> 1.1 over 6s).
*   **Wheel Navigation**: Added mouse wheel support to switch slides (up/down).
*   **UI Polish**:
    *   Removed harsh white borders from thumbnails.
    *   Added dynamic hover effects (scale + letter spacing) to the main title.
    *   Made text entrance animations more dramatic (larger Y-offset).

#### Loading Animation Iterations
The loading animation evolved through several requests:
1.  **Iteration 1 (5x5 Grid)**: 25 images, center image zoomed to fill screen.
2.  **Iteration 2 (4x3 Grid)**: 12 images, new placeholders, center hero image zoomed to fill screen.
3.  **Final State (5x3 Grid)**:
    *   **Grid**: 5 columns x 3 rows (15 images).
    *   **Images**: Mix of placeholders and the hero image at Index 7 (Row 1, Col 2).
    *   **Exit Animation**: Columns slide out vertically (alternating Up/Down).
    *   **Entry Transition**: The "Zoom to Fill" effect was **removed**. The Homepage now enters with its standard slide animation for consistency.

## Current State
*   **`Work.tsx`**: Fully interactive with polished physics-based scrolling.
*   **`Home.tsx`**: Features a 5x3 grid preloader that transitions into a smooth, cinematic slider with Ken Burns effects and wheel navigation.

## Key Files
*   `pages/Work.tsx`: Project list logic.
*   `pages/Home.tsx`: Homepage slider and Preloader component.
*   `data.ts`: Project data and image sources.
