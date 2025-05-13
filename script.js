document.addEventListener('DOMContentLoaded', () => {
    const hillSvg = document.getElementById('hillSvg');
    const dotsContainer = document.getElementById('dotsContainer');
    const newItemNameInput = document.getElementById('newItemName');
    const addItemBtn = document.getElementById('addItemBtn');
    const importSampleDataBtn = document.getElementById('importSampleDataBtn');
    const deleteItemBtn = document.getElementById('deleteItemBtn');

    const selectedItemNameDisplaySpan = document.getElementById('selectedItemNameDisplay');
    const editItemNameInput = document.getElementById('editItemNameInput');
    const editItemNameBtn = document.getElementById('editItemNameBtn');
    const saveItemNameBtn = document.getElementById('saveItemNameBtn');

    const itemCommentTextarea = document.getElementById('itemComment');
    const updateCommentBtn = document.getElementById('updateCommentBtn');
    const itemHistoryUl = document.querySelector('#itemHistory ul');

    const zoneInfoModal = document.getElementById('zoneInfoModal');
    const modalZoneName = document.getElementById('modalZoneName');
    const modalZoneDescription = document.getElementById('modalZoneDescription');
    const modalZoneChecklist = document.getElementById('modalZoneChecklist');
    const closeModalBtn = document.querySelector('.close-modal-btn');
    const zoneCues = document.querySelectorAll('.zone-cue');

    const leftInfoPanel = document.getElementById('leftInfoPanel');
    const panelToggleBtn = document.getElementById('panelToggleBtn');
    const panelToggleBtnMain = document.getElementById('panelToggleBtnMain'); 


    let items = [];
    let activeDot = null;
    let offsetX, offsetY;
    let selectedItemId = null;

    const AI_TRADING_SAMPLE_DATA = [
      {
        "id": "VS001",
        "name": "Slice 1: Basic Momentum Signal (Single Stock Proof-of-Concept)",
        "color": "#2980B9",
        "x": 55, 
        "y": 25, 
        "history": [
          { "timestamp": "01/07/2024, 09:00:00", "comment": "Zone 1: Define slice - Test simple momentum (50-day MA crossover) on AAPL. Goal: >52% accuracy, basic backtest.", "position": {"x": 10, "y": 80} },
          { "timestamp": "03/07/2024, 14:30:00", "comment": "Zone 2: Data collected for AAPL. Feature (50-day MA) pipeline built. Backtesting script drafted.", "position": {"x": 25, "y": 60} },
          { "timestamp": "05/07/2024, 17:00:00", "comment": "Zone 3: Initial model (simple rule) backtested. Achieved 53% accuracy. Technical validation done.", "position": {"x": 55, "y": 25} }
        ]
      },
      {
        "id": "VS002",
        "name": "Slice 2: Volatility Filter for Slice 1 Signal (AAPL)",
        "color": "#27AE60",
        "x": 28, 
        "y": 65, 
        "history": [
          { "timestamp": "08/07/2024, 10:00:00", "comment": "Zone 1: Hypothesis - Adding ATR filter to Slice 1's momentum signal will improve risk-adjusted return on AAPL. Define ATR parameters.", "position": {"x": 12, "y": 78} },
          { "timestamp": "10/07/2024, 11:00:00", "comment": "Zone 2: ATR feature calculation added to pipeline. Integrating into Slice 1 backtest logic.", "position": {"x": 28, "y": 65} }
        ]
      },
      {
        "id": "INFRA001",
        "name": "Core Backtesting Engine Enhancements & Refinements",
        "color": "#F39C12",
        "x": 45, 
        "y": 35, 
        "history": [
          { "timestamp": "01/07/2024, 09:30:00", "comment": "Zone 1: Define requirements for realistic commission & slippage models in backtester.", "position": {"x": 8, "y": 82} },
           { "timestamp": "04/07/2024, 16:15:00", "comment": "Zone 2: Prototyping variable slippage model based on volume.", "position": {"x": 25, "y": 50} },
           { "timestamp": "11/07/2024, 14:00:00", "comment": "Zone 3: Slippage model implemented & tested. Validating against historical trade data.", "position": {"x": 45, "y": 35} }
        ]
      },
      {
        "id": "DATA001",
        "name": "Data Pipeline: Real-time Quote Ingestion (IBKR API)",
        "color": "#8E44AD",
        "x": 18, 
        "y": 70, 
        "history": [
          { "timestamp": "08/07/2024, 17:00:00", "comment": "Zone 1: Define requirements & evaluate Interactive Brokers API for L1 real-time NASDAQ quotes.", "position": {"x": 5, "y": 85} },
          { "timestamp": "12/07/2024, 10:00:00", "comment": "Zone 1/2: Initial connection established. Prototyping data parsing and storage.", "position": {"x": 18, "y": 70} }
        ]
      },
      {
        "id": "MLMODEL001",
        "name": "Explore LSTM Model for Price Prediction (Top 5 NASDAQ Stocks)",
        "color": "#C0392B",
        "x": 30, 
        "y": 58, 
        "history": [
          { "timestamp": "10/07/2024, 13:00:00", "comment": "Zone 1: Hypothesis - LSTM can outperform MA crossover for 1-day prediction. Target: Top 5 liquid NASDAQ stocks.", "position": {"x": 10, "y": 81} },
          { "timestamp": "15/07/2024, 10:20:00", "comment": "Zone 2: Data prepared for LSTM. Initial model architecture defined. Starting training runs.", "position": {"x": 30, "y": 58} }
        ]
      },
      {
        "id": "RESEARCH001",
        "name": "Market Regime Detection Research & Prototype",
        "color": "#16A085",
        "x": 8,
        "y": 83, 
        "history": [
          { "timestamp": "15/07/2024, 14:00:00", "comment": "Zone 1: Explore methods (e.g., HMM, clustering) to identify different market regimes (bull, bear, volatile). Goal: Inform strategy switching.", "position": {"x": 8, "y": 83} }
        ]
      },
       {
        "id": "1700000000007", // Ensure unique ID if it was in the previous list
        "name": "MLOps - Initial Pipeline Design",
        "color": "#34495E", 
        "x": 12,
        "y": 79, 
        "history": [
          { "timestamp": "10/07/2024, 09:00:00", "comment": "Zone 1: Sketching out the CI/CD/CT pipeline for model training, versioning, and deployment.", "position": {"x": 12, "y": 79} }
        ]
      }
    ];

    const zoneDetailsData = {
        "1": {
            name: "1. Business & Data Understanding",
            description: "Define business objectives & success criteria. Conduct initial assessment of data availability, quality, and requirements. Formulate initial data mining goals for an experiment or vertical slice.",
            checklist: [
                "Business objectives & success criteria defined for this slice/experiment.",
                "Initial data sources identified and assessed for relevance.",
                "Preliminary data collection and exploration performed.",
                "Key risks and assumptions for this slice identified.",
                "Specific data mining goal for this iteration/slice articulated."
            ]
        },
        "2": {
            name: "2. Data Prep & Feature Prototyping",
            description: "In-depth data cleaning, transformation, and integration for the current slice. Begin constructing and evaluating initial features relevant to the iteration's data mining goal.",
            checklist: [
                "Relevant data subset selected and acquired for this iteration.",
                "Data cleaned, formatted, and initial quality issues addressed.",
                "First-pass feature engineering (construction/derivation) complete.",
                "Data integrated from necessary sources for this experiment.",
                "Prepared dataset ready for initial modeling."
            ]
        },
        "3": {
            name: "3. Modeling & Initial Evaluation",
            description: "Select and apply various modeling techniques. Build and assess initial models against technical metrics and the iteration's specific data mining goal. Highly iterative.",
            checklist: [
                "Appropriate modeling techniques selected and applied.",
                "Test design (e.g., train/test split) implemented.",
                "Initial models built and trained.",
                "Technical model performance assessed (e.g., accuracy, precision, error analysis).",
                "Learnings captured to inform next modeling iteration or business evaluation."
            ]
        },
        "4": {
            name: "4. Business Eval & Refinement", 
            description: "Evaluate technically promising models against broader business objectives. Refine models based on this evaluation and feedback. Determine if the current 'vertical slice' is 'good enough'.",
            checklist: [
                "Model results evaluated against business success criteria.",
                "Review of the modeling process and findings conducted.",
                "Decision made: iterate further, deploy this slice, or pivot.",
                "Models refined based on evaluation and feedback.",
                "Solution for this slice is validated and ready for deployment planning."
            ]
        },
        "5": {
            name: "5. Deployment & Project Review", 
            description: "Plan and execute the deployment of the validated model/solution slice (e.g., report, API, system integration). Conduct a final review of the slice/project iteration.",
            checklist: [
                "Deployment plan created and approved.",
                "Monitoring and maintenance plan outlined.",
                "Model/solution deployed to target environment.",
                "Final report/summary produced for this slice.",
                "Project iteration retrospective conducted, lessons learned captured."
            ]
        }
    };

    const loadItems = () => {
        const storedItems = localStorage.getItem('hillChartItems');
        items = storedItems ? JSON.parse(storedItems) : [];
        renderItems();
        if (!selectedItemId && items.length > 0) {
            selectItem(items[0].id);
        } else if (items.length === 0) {
            clearItemDetails();
        }
    };

    const getRandomColor = () => {
        const hue = Math.floor(Math.random() * 360);
        const saturation = Math.floor(Math.random() * 30) + 70;
        const lightness = Math.floor(Math.random() * 20) + 50;
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    };

    const renderItems = () => {
        dotsContainer.innerHTML = '';
        const MAX_LABEL_WIDTH_CHARS = 20; 
        const LABEL_LINE_HEIGHT_EM = 1.1;

        items.forEach(item => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (item.id === selectedItemId) {
                dot.classList.add('selected-dot');
            }
            dot.dataset.id = item.id;
            dot.style.backgroundColor = item.color;
            dot.style.left = `${item.x}%`;
            dot.style.top = `${item.y}%`;

            const labelSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            labelSvg.classList.add('dot-label-svg');
            
            const labelText = document.createElementNS("http://www.w3.org/2000/svg", "text");
            labelText.setAttribute('x', '50%'); 
            labelText.setAttribute('y', '0');   
            labelText.setAttribute('text-anchor', 'middle');
            labelText.classList.add('dot-label-text-actual');

            const words = item.name.split(' ');
            let currentLine = '';
            let lineCount = 0;

            words.forEach((word) => {
                const testLine = currentLine ? `${currentLine} ${word}` : word;
                if (testLine.length > MAX_LABEL_WIDTH_CHARS && currentLine !== '') {
                    const tspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
                    tspan.setAttribute('x', '50%'); 
                    if (lineCount === 0) {
                        tspan.setAttribute('y', `${LABEL_LINE_HEIGHT_EM}em`); 
                    } else {
                        tspan.setAttribute('dy', `${LABEL_LINE_HEIGHT_EM}em`);
                    }
                    tspan.textContent = currentLine;
                    labelText.appendChild(tspan);
                    currentLine = word;
                    lineCount++;
                } else {
                    currentLine = testLine;
                }
            });

            const tspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
            tspan.setAttribute('x', '50%'); 
            if (lineCount === 0) {
                tspan.setAttribute('y', `${LABEL_LINE_HEIGHT_EM}em`); 
            } else {
                tspan.setAttribute('dy', `${LABEL_LINE_HEIGHT_EM}em`);
            }
            tspan.textContent = currentLine;
            labelText.appendChild(tspan);
            
            labelSvg.appendChild(labelText);
            dot.appendChild(labelSvg);

            dot.addEventListener('mousedown', startDrag);
            dot.addEventListener('click', (e) => {
                e.stopPropagation();
                selectItem(item.id);
            });
            dotsContainer.appendChild(dot);
        });
    };

    const saveItems = () => {
        localStorage.setItem('hillChartItems', JSON.stringify(items));
    };

    const addItem = () => {
        const name = newItemNameInput.value.trim();
        if (!name) {
            alert('Please enter an item name.');
            return;
        }
        const newItem = {
            id: Date.now().toString(),
            name: name,
            color: getRandomColor(),
            x: 8,
            y: 82,
            history: [{ timestamp: new Date().toLocaleString(), comment: `Item created. Zone 1: Define & Discover.`, position: {x:8, y:82} }]
        };
        items.push(newItem);
        newItemNameInput.value = '';
        saveItems();
        renderItems(); 
        selectItem(newItem.id);
    };

    addItemBtn.addEventListener('click', addItem);
    newItemNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addItem();
        }
    });

    importSampleDataBtn.addEventListener('click', () => {
        if (confirm('This will overwrite any existing data with the AI Trading sample. Continue?')) {
            items = JSON.parse(JSON.stringify(AI_TRADING_SAMPLE_DATA)); 
            saveItems();
            selectedItemId = null; 
            loadItems(); 
             if (items.length > 0) { 
                selectItem(items[0].id);
            }
        }
    });

    function startDrag(e) {
        activeDot = e.target.closest('.dot');
        if (!activeDot) return;
        if (activeDot.dataset.id !== selectedItemId) {
            selectItem(activeDot.dataset.id);
        }
        activeDot.classList.add('dragging');
        offsetX = e.clientX - activeDot.getBoundingClientRect().left;
        offsetY = e.clientY - activeDot.getBoundingClientRect().top;
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', endDrag);
    }

    function drag(e) {
        if (!activeDot) return;
        e.preventDefault();
        const containerRect = dotsContainer.getBoundingClientRect();
        let x = e.clientX - containerRect.left - offsetX;
        let y = e.clientY - containerRect.top - offsetY;
        let xPercent = (x / containerRect.width) * 100;
        let yPercent = (y / containerRect.height) * 100;
        const dotWidthPercent = (activeDot.offsetWidth / containerRect.width) * 100;
        const dotHeightPercent = (activeDot.offsetHeight / containerRect.height) * 100;
        xPercent = Math.max(0, Math.min(xPercent, 100 - dotWidthPercent));
        yPercent = Math.max(0, Math.min(yPercent, 100 - dotHeightPercent));
        activeDot.style.left = `${xPercent}%`;
        activeDot.style.top = `${yPercent}%`;
    }

    function endDrag() {
        if (!activeDot) return;
        activeDot.classList.remove('dragging');
        const itemId = activeDot.dataset.id;
        const itemIndex = items.findIndex(item => item.id === itemId);
        if (itemIndex > -1) {
            const finalXPercent = parseFloat(activeDot.style.left);
            const finalYPercent = parseFloat(activeDot.style.top);
            items[itemIndex].x = finalXPercent;
            items[itemIndex].y = finalYPercent;
            const currentComment = itemCommentTextarea.value.trim();
            const defaultComment = `Moved to Zone reflecting new status. Pos: (${finalXPercent.toFixed(0)}%, ${finalYPercent.toFixed(0)}%).`;
            items[itemIndex].history.push({
                timestamp: new Date().toLocaleString(),
                comment: currentComment || defaultComment,
                position: { x: finalXPercent, y: finalYPercent }
            });
            itemCommentTextarea.value = '';
            saveItems();
            if (selectedItemId === itemId) {
                renderItemHistory(itemId);
            }
        }
        activeDot = null;
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', endDrag);
    }

    function selectItem(itemId) {
        selectedItemId = itemId;
        const item = items.find(i => i.id === itemId);
        document.querySelectorAll('.dot').forEach(d => d.classList.remove('selected-dot'));
        const currentDotElement = document.querySelector(`.dot[data-id="${itemId}"]`);
        if (currentDotElement) {
            currentDotElement.classList.add('selected-dot');
        }
        if (item) {
            selectedItemNameDisplaySpan.textContent = item.name;
            editItemNameInput.value = item.name;
            selectedItemNameDisplaySpan.classList.remove('hidden-input');
            editItemNameInput.classList.add('hidden-input');
            editItemNameBtn.classList.remove('hidden-input');
            saveItemNameBtn.classList.add('hidden-input');
            itemCommentTextarea.value = '';
            updateCommentBtn.disabled = false;
            deleteItemBtn.disabled = false;
            editItemNameBtn.disabled = false;
            renderItemHistory(itemId);
        } else {
           clearItemDetails();
        }
    }

    function clearItemDetails() {
        selectedItemNameDisplaySpan.textContent = 'Select or add an item.';
        editItemNameInput.value = '';
        selectedItemNameDisplaySpan.classList.remove('hidden-input');
        editItemNameInput.classList.add('hidden-input');
        editItemNameBtn.classList.remove('hidden-input');
        saveItemNameBtn.classList.add('hidden-input');
        itemCommentTextarea.value = '';
        updateCommentBtn.disabled = true;
        deleteItemBtn.disabled = true;
        editItemNameBtn.disabled = true; 
        itemHistoryUl.innerHTML = '';
        selectedItemId = null;
        document.querySelectorAll('.dot').forEach(d => d.classList.remove('selected-dot'));
    }
    
    editItemNameBtn.addEventListener('click', () => {
        if (!selectedItemId) return;
        selectedItemNameDisplaySpan.classList.add('hidden-input');
        editItemNameInput.classList.remove('hidden-input');
        editItemNameBtn.classList.add('hidden-input');
        saveItemNameBtn.classList.remove('hidden-input');
        editItemNameInput.focus();
        editItemNameInput.select();
    });

    saveItemNameBtn.addEventListener('click', () => {
        if (!selectedItemId) return;
        const newName = editItemNameInput.value.trim();
        const itemIndex = items.findIndex(i => i.id === selectedItemId);
        if (!newName) {
            alert("Item name cannot be empty.");
            if (itemIndex > -1) editItemNameInput.value = items[itemIndex].name;
            return;
        }
        if (itemIndex > -1) {
            const oldName = items[itemIndex].name;
            if (oldName !== newName) {
                items[itemIndex].name = newName;
                items[itemIndex].history.push({
                    timestamp: new Date().toLocaleString(),
                    comment: `Name changed from "${oldName}" to "${newName}".`,
                    position: { x: items[itemIndex].x, y: items[itemIndex].y }
                });
                saveItems();
                renderItems();
            }
        }
        selectedItemNameDisplaySpan.textContent = newName;
        selectedItemNameDisplaySpan.classList.remove('hidden-input');
        editItemNameInput.classList.add('hidden-input');
        editItemNameBtn.classList.remove('hidden-input');
        saveItemNameBtn.classList.add('hidden-input');
        if(itemIndex > -1) renderItemHistory(selectedItemId);
    });

    editItemNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !editItemNameInput.classList.contains('hidden-input')) {
            saveItemNameBtn.click();
        }
    });
    editItemNameInput.addEventListener('blur', (e) => {
        if (!saveItemNameBtn.classList.contains('hidden-input') && e.relatedTarget !== saveItemNameBtn) {
            const item = items.find(i => i.id === selectedItemId);
            if(item) {
                editItemNameInput.value = item.name;
                selectedItemNameDisplaySpan.textContent = item.name;
            }
            selectedItemNameDisplaySpan.classList.remove('hidden-input');
            editItemNameInput.classList.add('hidden-input');
            editItemNameBtn.classList.remove('hidden-input');
            saveItemNameBtn.classList.add('hidden-input');
        }
    });

    updateCommentBtn.addEventListener('click', () => {
        if (!selectedItemId) return;
        const itemIndex = items.findIndex(item => item.id === selectedItemId);
        const comment = itemCommentTextarea.value.trim();
        if (itemIndex > -1 && comment) {
            items[itemIndex].history.push({
                timestamp: new Date().toLocaleString(),
                comment: comment,
                position: { x: items[itemIndex].x, y: items[itemIndex].y } 
            });
            saveItems();
            renderItemHistory(selectedItemId);
            itemCommentTextarea.value = '';
        } else if (!comment) {
            alert("Please enter a comment to update history.");
        }
    });

    deleteItemBtn.addEventListener('click', () => {
        if (!selectedItemId) {
            alert("No item selected to delete.");
            return;
        }
        const itemToDelete = items.find(item => item.id === selectedItemId);
        if (itemToDelete && confirm(`Are you sure you want to delete item: "${itemToDelete.name}"? This cannot be undone.`)) {
            items = items.filter(item => item.id !== selectedItemId);
            saveItems();
            renderItems();
            clearItemDetails();
            if (items.length > 0) {
                selectItem(items[0].id);
            }
        }
    });

    function renderItemHistory(itemId) {
        itemHistoryUl.innerHTML = '';
        const item = items.find(i => i.id === itemId);
        if (item && item.history) {
            item.history.slice().reverse().forEach(entry => {
                const li = document.createElement('li');
                const commentSpan = document.createElement('span');
                commentSpan.classList.add('comment-entry');
                commentSpan.textContent = entry.comment;
                const timeSpan = document.createElement('span');
                timeSpan.classList.add('timestamp');
                timeSpan.textContent = `— ${entry.timestamp}`;
                li.appendChild(commentSpan);
                li.appendChild(timeSpan);
                itemHistoryUl.appendChild(li);
            });
        }
    }

    function openZoneModal(zoneId) {
        const zoneData = zoneDetailsData[zoneId];
        if (zoneData) {
            modalZoneName.textContent = zoneData.name;
            modalZoneDescription.textContent = zoneData.description;
            modalZoneChecklist.innerHTML = '';
            zoneData.checklist.forEach(itemText => {
                const li = document.createElement('li');
                li.textContent = itemText;
                modalZoneChecklist.appendChild(li);
            });
            zoneInfoModal.classList.add('show');
        }
    }

    function closeZoneModal() {
        zoneInfoModal.classList.remove('show');
    }

    zoneCues.forEach(cue => {
        cue.addEventListener('click', () => {
            const zoneId = cue.dataset.zone;
            openZoneModal(zoneId);
        });
    });

    closeModalBtn.addEventListener('click', closeZoneModal);

    window.addEventListener('click', (event) => {
        if (event.target === zoneInfoModal) {
            closeZoneModal();
        }
    });

    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && zoneInfoModal.classList.contains('show')) {
            closeZoneModal();
        }
    });

    // --- Left Panel Toggle Logic ---
    function togglePanel() {
        const isCollapsed = leftInfoPanel.classList.toggle('collapsed');
        if (isCollapsed) {
            panelToggleBtn.innerHTML = '»'; 
            panelToggleBtn.style.right = ''; 
            panelToggleBtn.style.left = '0px'; 
            panelToggleBtnMain.innerHTML = '»'; // Keep main consistent or change if you prefer
        } else {
            panelToggleBtn.innerHTML = '«'; 
            panelToggleBtn.style.left = ''; 
            panelToggleBtn.style.right = '-30px'; // Adjust based on actual button width + desired overlap
            panelToggleBtnMain.innerHTML = '«';
        }
        panelToggleBtnMain.style.display = isCollapsed ? 'block' : 'none';
    }

    if (panelToggleBtn) panelToggleBtn.addEventListener('click', togglePanel);
    if (panelToggleBtnMain) panelToggleBtnMain.addEventListener('click', togglePanel);
    // --- END Left Panel Toggle Logic ---

    loadItems();
});