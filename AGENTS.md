# Agent Notes

This project has been simplified to a single-page application showing a bouncing faces animation.
The previous complex functionality (drawing, photo sharing, etc.) has been removed.

## Architecture
- `src/App.tsx`: Main entry point, renders Home.
- `src/pages/Home.tsx`: Renders the BouncingSlide component.
- `src/components/Slides/BouncingSlide.tsx`: Contains the animation logic.
- Images are served from `public/birthday-photos`.