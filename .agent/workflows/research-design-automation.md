---
description: Generate visual designs from provided content
---

1.  **Input Content**: Ask the user for the content if not provided (e.g., text for slides, key points, or a specific draft).
2.  **Visual Philosophy**:
    -   Read `skill/content-research-writer/canvas-design/SKILL.md`.
    -   Read **Brand Guidelines**: `/Users/admin/Desktop/Claude/awesome-claude-skills-master/brand-guidelines/SKILL.md`.
    -   Create a "Visual Philosophy" in `design_philosophy.md` that defines the aesthetic, color palette, and composition based on the content AND the Brand Guidelines. Ensure the design aligns with Anthropic's official brand colors (Dark: `#141413`, Light: `#faf9f5`, Accents: `#d97757`, `#6a9bcc`, `#788c5d`) and typography (Headings: Poppins, Body: Lora).
3.  **Generate AI Assets**:
    -   Use the `generate_image` tool to create high-quality, professional assets that match the Visual Philosophy and Brand Guidelines.
4.  **Design Execution**:
    -   Create responsive HTML/CSS templates in `design_carousel.html` to layout the content and AI assets.
    -   **Strictly enforce premium aesthetics**:
        -   **Colors**: Use the brand palette defined in `design_philosophy.md`.
        -   **Typography**: Use **Poppins** for headings and **Lora** for body text (use Google Fonts).
        -   **Layout**: Modern, smooth, and consistent.
    -   Render the final design and take screenshots of each section/slide.
5.  **Notify User**:
    -   Inform the user where the design files (`design_philosophy.md`, `design_carousel.html`) and screenshots are located.

