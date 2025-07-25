# Plugin Sources

This directory contains the source configurations for the individual Obsidian plugins:

## GOKU/
Multi-model AI chat plugin source files and configuration.

## VEGETA/
Terminal output plugin source files and configuration.

## Development Notes

The actual UI development happens in the main `src/` directory of this project. These subdirectories contain the plugin-specific configurations and serve as reference for the actual Obsidian plugin structure.

For UI development and testing, use the main development server:
```bash
npm run dev
```

This will start the unified development environment where both GOKU and VEGETA can be tested simultaneously.