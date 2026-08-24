const cases = [];

let selectedCase = 0;


/* ==============================
   LOAD SCORE FILE
================================ */

async function loadScores() {

    try {

       // Adds a timestamp so the browser is forced to fetch the newest version
const response = await fetch("score.txt?t=" + new Date().getTime());
        if (!response.ok) {
            throw new Error("score.txt not found");
        }

        const text = await response.text();

        const blocks = text
            .split(/-{20,}/)
            .map(block => block.trim())
            .filter(block => block.length > 0);


        cases.length = 0;


        blocks.forEach((block, index) => {

            const messageMatch =
                block.match(/Message:\s*(.*)/);

            const scoreMatch =
                block.match(/Score:\s*(\d+)\/10/);

            const levelMatch =
                block.match(/Stress Level:\s*(.*)/);

            const indicatorsMatch =
                block.match(/Indicators:\s*(.*)/);


            if (!messageMatch || !scoreMatch || !levelMatch) {
                return;
            }


            let indicators = [];


            if (
                indicatorsMatch &&
                indicatorsMatch[1].trim() !== "None detected"
            ) {

                indicators = indicatorsMatch[1]
                    .split(",")
                    .map(item => item.trim())
                    .filter(item => item.length > 0);

            }


            cases.push({

                id:
                    "NHAA-" +
                    String(index + 1).padStart(4, "0"),

                message:
                    messageMatch[1].trim(),

                score:
                    Number(scoreMatch[1]),

                level:
                    levelMatch[1].trim().toUpperCase(),

                indicators:
                    indicators,

                status:
                    "PENDING"

            });

        });


        selectedCase = 0;

        updateStats();

        renderCases();

        showDetails();


    } catch (error) {

        console.error(error);

        const container =
            document.getElementById("caseList");

        if (container) {

            container.innerHTML = `
                <div style="
                    padding:40px;
                    text-align:center;
                    color:#8fa8c0;
                ">
                    Unable to load cases.
                    <br><br>
                    Make sure score.txt is inside
                    the dashboard folder.
                </div>
            `;

        }

    }

}


/* ==============================
   UPDATE STATISTICS
================================ */

function updateStats() {

    const total =
        cases.length;


    const high =
        cases.filter(
            item => item.level === "HIGH"
        ).length;


    const medium =
        cases.filter(
            item => item.level === "MEDIUM"
        ).length;


    const low =
        cases.filter(
            item => item.level === "LOW"
        ).length;


    document.getElementById("totalCases").textContent =
        total;

    document.getElementById("highCases").textContent =
        high;

    document.getElementById("mediumCases").textContent =
        medium;

    document.getElementById("lowCases").textContent =
        low;

}


/* ==============================
   DISPLAY CASE LIST
================================ */

function renderCases() {

    const container =
        document.getElementById("caseList");


    container.innerHTML = "";


    if (cases.length === 0) {

        container.innerHTML = `
            <div style="
                padding:40px;
                text-align:center;
                color:#8fa8c0;
            ">
                No cases available.
            </div>
        `;

        return;

    }


    cases.forEach((item, index) => {

        const caseElement =
            document.createElement("div");


        caseElement.className =
            "case-item";


        if (index === selectedCase) {

            caseElement.classList.add("active");

        }


        caseElement.innerHTML = `

            <div class="case-message">
                ${escapeHTML(item.message)}
            </div>

            <div class="case-id">
                ${item.id}
            </div>

            <div class="case-level ${item.level.toLowerCase()}">
                ${item.level}
            </div>

            <div class="case-score">
                ${item.score}/10
            </div>

            <button
                class="view-btn"
                type="button">
                VIEW
            </button>

            ${
                item.status !== "PENDING"
                ?
                `
                <span style="
                    margin-left:10px;
                    font-size:11px;
                    font-weight:700;
                    color:${
                        item.status === "REVIEWED"
                        ? "#45e6a5"
                        : "#ff647c"
                    };
                ">
                    ${
                        item.status === "REVIEWED"
                        ? "✓ REVIEWED"
                        : "⚑ ESCALATED"
                    }
                </span>
                `
                :
                ""
            }

        `;


        caseElement.addEventListener(
            "click",
            function () {

                selectedCase = index;

                renderCases();

                showDetails();

            }
        );


        container.appendChild(caseElement);

    });

}


/* ==============================
   SHOW SELECTED CASE
================================ */

function showDetails() {

    if (cases.length === 0) {
        return;
    }


    const item =
        cases[selectedCase];


    /* Case ID */

    const selectedId =
        document.getElementById("selectedId");


    selectedId.textContent =
        item.id;


    /* Details container */

    const details =
        document.getElementById("caseDetails");


    const progress =
        item.score * 10;


    let levelClass =
        item.level.toLowerCase();


    /* Indicators */

    let indicatorHTML = "";


    if (item.indicators.length > 0) {

        indicatorHTML =
            item.indicators.map(
                indicator => `
                    <div style="
                        background:#102234;
                        border:1px solid #18364d;
                        padding:12px 14px;
                        border-radius:10px;
                        margin-bottom:8px;
                        color:#d9e8f5;
                    ">
                        <span style="
                            color:#45e6a5;
                            font-weight:bold;
                            margin-right:8px;
                        ">
                            ✓
                        </span>

                        ${escapeHTML(indicator)}
                    </div>
                `
            ).join("");

    } else {

        indicatorHTML = `
            <div style="
                background:#102234;
                padding:12px;
                border-radius:10px;
                color:#8fa8c0;
            ">
                No specific indicator detected
            </div>
        `;

    }


    /* Status */

    let statusHTML = "";


    if (item.status === "REVIEWED") {

        statusHTML = `
            <div style="
                margin-top:15px;
                padding:12px;
                border-radius:10px;
                background:rgba(69,230,165,0.10);
                border:1px solid rgba(69,230,165,0.30);
                color:#45e6a5;
                font-weight:700;
            ">
                ✓ CASE REVIEWED BY OFFICER
            </div>
        `;

    }


    if (item.status === "ESCALATED") {

        statusHTML = `
            <div style="
                margin-top:15px;
                padding:12px;
                border-radius:10px;
                background:rgba(255,100,124,0.10);
                border:1px solid rgba(255,100,124,0.30);
                color:#ff647c;
                font-weight:700;
            ">
                ⚑ CASE ESCALATED
            </div>
        `;

    }


    /* Full officer panel */

    details.innerHTML = `

        <div style="padding:26px;">


            <!-- MESSAGE -->

            <div style="
                margin-bottom:25px;
            ">

                <div style="
                    font-size:11px;
                    letter-spacing:2px;
                    color:#6e8ca8;
                    margin-bottom:8px;
                    font-weight:700;
                ">
                    ORIGINAL MESSAGE
                </div>

                <div style="
                    background:#0d1d2c;
                    border:1px solid #18364d;
                    padding:16px;
                    border-radius:12px;
                    color:#dceaf6;
                    line-height:1.6;
                ">
                    "${escapeHTML(item.message)}"
                </div>

            </div>


            <!-- STRESS LEVEL -->

            <div style="
                margin-bottom:22px;
            ">

                <div style="
                    font-size:11px;
                    letter-spacing:2px;
                    color:#6e8ca8;
                    margin-bottom:8px;
                ">
                    STRESS LEVEL
                </div>

                <div class="stress-display ${levelClass}">
                    ${item.level}
                </div>

            </div>


            <!-- SCORE -->

            <div style="
                margin-bottom:25px;
            ">

                <div style="
                    font-size:11px;
                    letter-spacing:2px;
                    color:#6e8ca8;
                    margin-bottom:8px;
                ">
                    STRESS SCORE
                </div>

                <div style="
                    font-size:28px;
                    font-weight:800;
                    color:#f1f7fc;
                    margin-bottom:10px;
                ">
                    ${item.score}/10
                </div>


                <div style="
                    width:100%;
                    height:8px;
                    background:#172b3d;
                    border-radius:20px;
                    overflow:hidden;
                ">

                    <div style="
                        width:${progress}%;
                        height:100%;
                        background:linear-gradient(
                            90deg,
                            #31d7f5,
                            #7467ff
                        );
                        border-radius:20px;
                        transition:width 0.5s ease;
                    ">
                    </div>

                </div>

            </div>


            <!-- INDICATORS -->

            <div style="
                margin-bottom:25px;
            ">

                <div style="
                    font-size:11px;
                    letter-spacing:2px;
                    color:#6e8ca8;
                    margin-bottom:10px;
                    font-weight:700;
                ">
                    DETECTED INDICATORS
                </div>

                ${indicatorHTML}

            </div>


            <!-- RECOMMENDATION -->

            <div>

                <div style="
                    font-size:11px;
                    letter-spacing:2px;
                    color:#6e8ca8;
                    margin-bottom:10px;
                    font-weight:700;
                ">
                    SYSTEM RECOMMENDATION
                </div>

                <div style="
                    background:#102234;
                    border:1px solid #18364d;
                    padding:14px;
                    border-radius:10px;
                    color:#dceaf6;
                ">
                    👮 Human officer review recommended.
                </div>

            </div>


            ${statusHTML}


            <!-- ACTION BUTTONS -->

            <div style="
                display:flex;
                gap:12px;
                margin-top:25px;
            ">

                <button
                    id="reviewBtn"
                    type="button"
                    style="
                        flex:1;
                        padding:14px;
                        border:0;
                        border-radius:10px;
                        background:#31d7f5;
                        color:#071521;
                        font-weight:800;
                        cursor:pointer;
                    "
                >
                    ✓ MARK AS REVIEWED
                </button>


                <button
                    id="escalateBtn"
                    type="button"
                    style="
                        flex:1;
                        padding:14px;
                        border:1px solid #ff647c;
                        border-radius:10px;
                        background:rgba(255,100,124,0.08);
                        color:#ff647c;
                        font-weight:800;
                        cursor:pointer;
                    "
                >
                    ⚑ ESCALATE
                </button>

            </div>


        </div>

    `;


    /* REVIEW BUTTON */

    document
        .getElementById("reviewBtn")
        .addEventListener(
            "click",
            function () {

                item.status = "REVIEWED";

                renderCases();

                showDetails();

            }
        );


    /* ESCALATE BUTTON */

    document
        .getElementById("escalateBtn")
        .addEventListener(
            "click",
            function () {

                item.status = "ESCALATED";

                renderCases();

                showDetails();

            }
        );

}


/* ==============================
   SAFE TEXT
================================ */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent =
        text;

    return div.innerHTML;

}
function setupNavigation() {

    const dashboardNav =
        document.getElementById("dashboardNav");

    const priorityNav =
        document.getElementById("priorityNav");

    const historyNav =
        document.getElementById("historyNav");


    dashboardNav.addEventListener("click", () => {

        setActiveNav(dashboardNav);

        renderDashboard();

    });


    priorityNav.addEventListener("click", () => {

        setActiveNav(priorityNav);

        renderPriorityCases();

    });


    historyNav.addEventListener("click", () => {

        setActiveNav(historyNav);

        renderReviewHistory();

    });

}
function setActiveNav(activeItem) {

    document
        .querySelectorAll(".nav-item")
        .forEach(item => {

            item.classList.remove("active");

        });


    activeItem.classList.add("active");

}
function renderDashboard() {

    const casesPanel =
        document.querySelector(".cases-panel");

    const detailsPanel =
        document.querySelector(".details-panel");


    casesPanel.style.display = "block";

    detailsPanel.style.display = "block";


    renderCases();

    showDetails();

}
function renderPriorityCases() {

    const container =
        document.getElementById("caseList");


    const priorityCases =
        cases.filter(
            item =>
                item.level === "HIGH" ||
                item.level === "MEDIUM"
        );


    container.innerHTML = "";


    if (priorityCases.length === 0) {

        container.innerHTML = `
            <div style="
                padding:50px;
                text-align:center;
                color:#8fa8c0;
            ">

                <div style="
                    font-size:40px;
                    margin-bottom:15px;
                ">
                    ✓
                </div>

                <h3>
                    No Priority Cases
                </h3>

                <p>
                    All current cases are low priority.
                </p>

            </div>
        `;

        return;

    }


    priorityCases.forEach(item => {

        const element =
            document.createElement("div");


        element.className =
            "case-item";


        element.innerHTML = `

            <div class="case-message">

                ${escapeHTML(item.message)}

            </div>

            <div class="case-id">

                ${item.id}

            </div>

            <div class="
                case-level
                ${item.level.toLowerCase()}
            ">

                ${item.level}

            </div>

            <div class="case-score">

                ${item.score}/10

            </div>

            <button
                class="view-btn"
                type="button">

                VIEW

            </button>

        `;


        element.addEventListener(
            "click",
            () => {

                const index =
                    cases.indexOf(item);

                selectedCase =
                    index;

                renderCases();

                showDetails();

            }
        );


        container.appendChild(element);

    });

}
function renderReviewHistory() {

    const container =
        document.getElementById("caseList");


    const historyCases =
        cases.filter(
            item =>
                item.status === "REVIEWED" ||
                item.status === "ESCALATED"
        );


    container.innerHTML = "";


    if (historyCases.length === 0) {

        container.innerHTML = `
            <div style="
                padding:50px;
                text-align:center;
                color:#8fa8c0;
            ">

                <div style="
                    font-size:40px;
                    margin-bottom:15px;
                ">
                    ◷
                </div>

                <h3>
                    No Review History
                </h3>

                <p>
                    Reviewed cases will appear here.
                </p>

            </div>
        `;

        return;

    }


    historyCases.forEach(item => {

        const element =
            document.createElement("div");


        element.className =
            "case-item";


        const statusColor =
            item.status === "REVIEWED"
                ? "#45e6a5"
                : "#ff647c";


        const statusText =
            item.status === "REVIEWED"
                ? "✓ REVIEWED"
                : "⚑ ESCALATED";


        element.innerHTML = `

            <div class="case-message">

                ${escapeHTML(item.message)}

            </div>

            <div class="case-id">

                ${item.id}

            </div>

            <div class="case-score">

                ${item.score}/10

            </div>

            <div style="
                color:${statusColor};
                font-size:11px;
                font-weight:800;
            ">

                ${statusText}

            </div>

        `;


        element.addEventListener(
            "click",
            () => {

                selectedCase =
                    cases.indexOf(item);

                showDetails();

            }
        );


        container.appendChild(element);

    });

}

/* ==============================
   START
================================ */

setupNavigation();

loadScores();

// Automatically reload the scores every 3 seconds
setInterval(loadScores, 3000);
