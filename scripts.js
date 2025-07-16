document.addEventListener('DOMContentLoaded', () => {
    // Functions for daily task generation
    function getDayNumber() {
        const startDate = new Date('2025-06-17T00:00:00');
        const now = new Date();
        const diffInMs = now - startDate;
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
        return diffInDays + 1;
    }

    function getMonth(dayNum) {
        if (dayNum <= 28) return 1;
        if (dayNum <= 56) return 2;
        if (dayNum <= 84) return 3;
        if (dayNum <= 112) return 4;
        if (dayNum <= 140) return 5;
        if (dayNum <= 184) return 6;
        return 7; // for complete
    }

    function getLocalDay(dayNum, month) {
        if (month <= 5) {
            return dayNum - (month - 1) * 28;
        }
        return dayNum - 140;
    }

    function getWeekInMonth(localDay) {
        return Math.ceil(localDay / 7);
    }

    function getRoutine(month) {
        switch (month) {
            case 1: return 'Fund (HTML/CSS/JS/Git) - 15m tut +20-30m code +5m break.';
            case 2: return 'FE (React) - 10-15m tut +15-20m code +5m CTF.';
            case 3: return 'BE (Node/Exp) - 10m vid +20-30m code +5m break.';
            case 4: return 'DB (Mongo) - 10m tut +20-30m code +5m rew.';
            case 5: return 'Block/Hack (Sol) - 15m learn +20-30m code/test +5m THM.';
            case 6: return 'Dep/Port - 10-15m learn +20-30m dep +5m X share.';
            default: return '';
        }
    }

    function getPractice(month, week) {
        if (week <= 2) {
            switch (month) {
                case 1: return 'HTML/CSS homepage bg.';
                case 2: return 'React basics (wallet).';
                case 3: return 'APIs.';
                case 4: return 'CRUD.';
                case 5: return 'Contracts.';
                case 6: return 'Dep.';
            }
        } else {
            switch (month) {
                case 1: return 'JS val + Git.';
                case 2: return 'React+Ethers (bal/form).';
                case 3: return 'Sec (JWT).';
                case 4: return 'Int.';
                case 5: return 'Ethers+tests.';
                case 6: return 'Port/job.';
            }
        }
        return '';
    }

    function getTest(month, localDay, isFriday) {
        let testStr = '';
        if (month <= 2) {
            testStr = 'weekly Fridays';
            testStr += isFriday ? '—test due today.' : '—no today.';
        } else {
            testStr = 'biwk (D8,22/mo)';
            testStr += (localDay === 8 || localDay === 22) ? '—test due today.' : '—no today.';
        }
        return testStr;
    }

    function getMilestone(month) {
        switch (month) {
            case 1: return 'Resp repo D28.';
            case 2: return 'Int UI D56.';
            case 3: return 'Sec APIs D84.';
            case 4: return 'Data disp D112.';
            case 5: return 'Sec app D140.';
            case 6: return 'Job port D184.';
            default: return '';
        }
    }

    // Generate today's task
    const dayNum = getDayNumber();
    const taskP = document.getElementById('today-task');
    if (dayNum > 184) {
        taskP.innerText = 'Plan complete!';
    } else if (dayNum < 1) {
        taskP.innerText = 'Plan not started yet.';
    } else {
        const month = getMonth(dayNum);
        const localDay = getLocalDay(dayNum, month);
        const week = getWeekInMonth(localDay);
        const routine = getRoutine(month);
        const practice = getPractice(month, week);
        const isFriday = new Date().getDay() === 5;
        const test = getTest(month, localDay, isFriday);
        const monthEnds = [28, 56, 84, 112, 140, 184];
        const milestone = monthEnds.includes(dayNum) ? ` Milestone: ${getMilestone(month)}` : '';
        taskP.innerText = `FS Dev Day ${dayNum}: Month ${month} – ${routine}. Practice: ${practice}. Test if due: ${test}.${milestone} Reward! Trello check.`;
    }

    // Board functionality
    function createCard(text) {
        const li = document.createElement('li');
        li.className = 'card';
        li.id = 'card-' + Date.now(); // Set unique ID immediately
        li.draggable = true;

        const textSpan = document.createElement('span');
        textSpan.className = 'card-text';
        textSpan.innerText = text;
        li.appendChild(textSpan);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerText = 'x';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent drag or other events
            li.remove();
            saveBoard();
        });
        li.appendChild(deleteBtn);

        li.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', li.id);
        });

        li.addEventListener('dblclick', () => {
            const newText = prompt('Edit card:', textSpan.innerText);
            if (newText !== null) {
                textSpan.innerText = newText;
                saveBoard();
            }
        });

        return li;
    }

    function saveBoard() {
        const data = {};
        document.querySelectorAll('.list ul').forEach((ul) => {
            const listId = ul.parentElement.id;
            data[listId] = Array.from(ul.children).map((li) => li.querySelector('.card-text').innerText);
        });
        localStorage.setItem('fsdev_board', JSON.stringify(data));
    }

    function loadBoard() {
        const data = JSON.parse(localStorage.getItem('fsdev_board'));
        if (!data) {
            // Initial milestones in To Do
            const milestones = [
                'Month 1 Milestone: Resp repo D28',
                'Month 2 Milestone: Int UI D56',
                'Month 3 Milestone: Sec APIs D84',
                'Month 4 Milestone: Data disp D112',
                'Month 5 Milestone: Sec app D140',
                'Month 6 Milestone: Job port D184'
            ];
            const todoUl = document.getElementById('todo-list');
            milestones.forEach((text) => {
                const li = createCard(text);
                todoUl.appendChild(li);
            });
            saveBoard();
        } else {
            for (const listId in data) {
                const ul = document.getElementById(`${listId}-list`);
                ul.innerHTML = '';
                data[listId].forEach((text) => {
                    const li = createCard(text);
                    ul.appendChild(li);
                });
            }
        }
    }

    loadBoard();

    // Drag and Drop events
    const uls = document.querySelectorAll('.list ul');
    uls.forEach((ul) => {
        ul.addEventListener('dragover', (e) => e.preventDefault());
        ul.addEventListener('drop', (e) => {
            e.preventDefault();
            const id = e.dataTransfer.getData('text/plain');
            const card = document.getElementById(id);
            if (card) {
                ul.appendChild(card);
                saveBoard();
            }
        });
    });

    // Add card buttons
    document.querySelectorAll('.add-card').forEach((btn) => {
        btn.addEventListener('click', () => {
            const text = prompt('Enter card content:');
            if (text) {
                const li = createCard(text);
                const ul = btn.previousElementSibling; // the ul
                ul.appendChild(li);
                saveBoard();
            }
        });
    });

    // Add today's task to board
    document.getElementById('add-today').addEventListener('click', () => {
        const text = taskP.innerText;
        if (text && text !== 'Calculating...') {
            const li = createCard(text);
            document.getElementById('todo-list').appendChild(li);
            saveBoard();
        }
    });
});
