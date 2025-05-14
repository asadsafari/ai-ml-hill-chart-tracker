# ML Project Hill Chart

An interactive Hill Chart visualizer for tracking progress and uncertainty in AI/Machine Learning projects. This tool helps teams visualize where project tasks stand, from initial exploration to final deployment, using the intuitive "uphill/downhill" metaphor.

Built with vanilla JavaScript, HTML, and CSS – no external frameworks required.

<p align="center"><img src="Screenshot 2025-05-13 at 19.19.24.png" alt="ML Project Hill Chart Screenshot" width="700"></p> 

## Demo
Want to try it yourself?

Head over to: 
https://asadsafari.github.io/ai-ml-hill-chart-tracker/ 🖱️

## The Challenge with ML Project Timelines

Estimating and communicating timelines for Machine Learning projects can be notoriously difficult. Unlike traditional software development, ML projects often involve significant R&D, data exploration, and iterative modeling where outcomes are not always predictable. This tool aims to provide a more nuanced way to track progress beyond simple task lists or Gantt charts.

## Features

*   **Interactive Hill Chart:** Visualize project items (tasks, slices, experiments) on a 2D plane representing their progress and perceived uncertainty.
*   **AI/ML Specific Zones:** The Hill Chart is divided into 5 zones tailored for common AI/ML project phases:
    1.  Business & Data Understanding
    2.  Data Prep & Feature Prototyping
    3.  Modeling & Initial Evaluation
    4.  Business Eval & Refinement
    5.  Deployment & Project Review
*   **Draggable Items:** Easily move items on the chart as their status changes.
*   **Item Details:**
    *   Add, rename, and delete project items.
    *   Add comments to track progress, decisions, or blockers.
    *   View a history log for each item.
*   **Zone Information:** Click on zone labels to get more details about the activities and "done" criteria for each phase.
*   **Sample Project Data:** Includes an "AI Trading Platform" sample project to demonstrate usage.
*   **Local Storage Persistence:** Your project data is saved in your browser's local storage, so your work persists between sessions.
*   **Collapsible Info Panel:** Provides context or project-specific information alongside the chart.

## How it Relates to the Hill Chart Concept

This project is inspired by the **Hill Chart concept popularized by Basecamp**.
*   **Uphill (Left Side - Zones 1 & 2):** "Figuring it out" – High uncertainty, exploration, defining the problem and approach.
*   **Top of the Hill (Middle - Zone 3):** "Solution is clear" – The path forward for a specific piece of work is understood.
*   **Downhill (Right Side - Zones 4 & 5):** "Making it happen" – Execution of a known solution, lower uncertainty.

This tool adapts this concept to the typical lifecycle of an AI/ML project, breaking down work into "vertical slices" that can be tracked across these phases.

## Getting Started

1.  Clone this repository or download the files.
2.  Open `index.html` in your web browser.

That's it! You can start adding your project items or import the sample data to see it in action.

## Usage

*   **Add Item:** Type a name in the input field and click "Add Item." New items start in Zone 1.
*   **Move Item:** Click and drag a dot to its new position on the chart. This automatically logs a history entry.
*   **Select Item:** Click on a dot to view its details in the panel below the chart.
*   **Edit Name:** Select an item, then click the pencil icon (✎) next to its name in the details panel.
*   **Add Comment:** Select an item, type in the comment box, and click "Update Comment."
*   **Delete Item:** Select an item and click "Delete Item."
*   **Import Sample Data:** Click "Import Sample Project" to load predefined data for an AI Trading Platform (this will overwrite existing data).
*   **View Zone Details:** Click on any of the numbered zone labels on the chart to open a modal with descriptions and checklists.

## Built With

*   HTML5
*   CSS3
*   Vanilla JavaScript (ES6+)

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Acknowledgements

*   The Hill Chart concept was popularized by [Basecamp](https://basecamp.com/features/hill-charts).
*   Icons used are standard Unicode characters.
