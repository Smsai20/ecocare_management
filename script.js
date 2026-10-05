/* =====================================================
   ECOCARE SMART WASTE MANAGEMENT
===================================================== */


/* ================= LOCAL STORAGE ================= */

let reports =
    JSON.parse(
        localStorage.getItem("ecoReports")
    ) || [];


/* ================= SAMPLE DATA ================= */

/*
   First time website open ayinappudu
   empty ga undakunda sample data.
*/

if (reports.length === 0) {

    reports = [

        {
            id: Date.now() + 1,

            name: "Ramesh",

            location: "Kakinada Beach",

            type: "Plastic Waste",

            description:
            "Plastic bottles and covers found near the beach.",

            status: "Pending",

            date: new Date().toLocaleDateString()
        },


        {
            id: Date.now() + 2,

            name: "Priya",

            location: "Main Market",

            type: "Food Waste",

            description:
            "Food waste is being dumped near the market.",

            status: "Resolved",

            date: new Date().toLocaleDateString()
        },


        {
            id: Date.now() + 3,

            name: "Arun",

            location: "City Park",

            type: "Mixed Waste",

            description:
            "Mixed waste is present near the park entrance.",

            status: "Pending",

            date: new Date().toLocaleDateString()
        }

    ];

    saveReports();

}


/* ================= SAVE ================= */

function saveReports() {

    localStorage.setItem(
        "ecoReports",
        JSON.stringify(reports)
    );

}


/* ================= FORM ================= */

document
    .getElementById("wasteForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();


        const name =
            document.getElementById("userName").value;


        const location =
            document.getElementById("location").value;


        const type =
            document.getElementById("wasteType").value;


        const description =
            document.getElementById("description").value;


        const newReport = {

            id: Date.now(),

            name: name,

            location: location,

            type: type,

            description: description,

            status: "Pending",

            date: new Date().toLocaleDateString()

        };


        reports.unshift(newReport);


        saveReports();


        displayReports();


        updateDashboard();


        showToast(
            "Waste report submitted successfully!"
        );


        this.reset();


        document
            .getElementById("recent")
            .scrollIntoView({
                behavior: "smooth"
            });

    });



/* ================= DISPLAY REPORTS ================= */

function displayReports() {

    const container =
        document.getElementById("reportsContainer");


    const noReports =
        document.getElementById("noReports");


    const search =
        document
        .getElementById("searchInput")
        .value
        .toLowerCase();


    const filter =
        document
        .getElementById("filterType")
        .value;


    const filteredReports =
        reports.filter(function(report) {


            const searchableText =

                (
                    report.name +
                    " " +
                    report.location +
                    " " +
                    report.type +
                    " " +
                    report.description
                )
                .toLowerCase();


            const matchesSearch =
                searchableText.includes(search);


            const matchesFilter =
                filter === "all" ||
                report.type === filter;


            return (
                matchesSearch &&
                matchesFilter
            );

        });


    container.innerHTML = "";


    if (filteredReports.length === 0) {

        noReports.style.display = "block";

        return;

    }


    noReports.style.display = "none";


    filteredReports.forEach(function(report) {

        const card =
            document.createElement("div");


        card.className =
            "report-card";


        const statusClass =
            report.status === "Resolved"
            ? "resolved"
            : "pending";


        card.innerHTML = `

            <div class="report-top">

                <span class="waste-badge">

                    ${report.type}

                </span>

                <span class="status ${statusClass}">

                    ${report.status}

                </span>

            </div>


            <h3>

                ${report.location}

            </h3>


            <div class="report-location">

                <i class="fa-solid fa-location-dot"></i>

                ${report.location}

            </div>


            <p>

                ${report.description}

            </p>


            <p style="margin-top:8px;">

                <strong>Reported by:</strong>
                ${report.name}

            </p>


            <p style="margin-top:5px;">

                <strong>Date:</strong>
                ${report.date}

            </p>


            <div class="report-actions">

                ${
                    report.status === "Pending"

                    ?

                    `
                    <button
                        class="resolve-btn"
                        onclick="resolveReport(${report.id})">

                        <i class="fa-solid fa-check"></i>

                        Resolve

                    </button>
                    `

                    :

                    `
                    <button
                        class="resolve-btn"
                        disabled>

                        <i class="fa-solid fa-circle-check"></i>

                        Resolved

                    </button>
                    `
                }


                <button
                    class="delete-btn"
                    onclick="deleteReport(${report.id})">

                    <i class="fa-solid fa-trash"></i>

                    Delete

                </button>

            </div>

        `;


        container.appendChild(card);

    });

}



/* ================= SEARCH ================= */

document
    .getElementById("searchInput")
    .addEventListener(
        "input",
        displayReports
    );


document
    .getElementById("filterType")
    .addEventListener(
        "change",
        displayReports
    );



/* ================= RESOLVE ================= */

function resolveReport(id) {

    const report =
        reports.find(
            item => item.id === id
        );


    if (!report) return;


    report.status = "Resolved";


    saveReports();


    displayReports();


    updateDashboard();


    showToast(
        "Waste report marked as resolved!"
    );

}



/* ================= DELETE ================= */

function deleteReport(id) {

    reports =
        reports.filter(
            report => report.id !== id
        );


    saveReports();


    displayReports();


    updateDashboard();


    showToast(
        "Report deleted successfully!"
    );

}



/* ================= DASHBOARD ================= */

function updateDashboard() {

    const total =
        reports.length;


    const pending =
        reports.filter(
            report =>
            report.status === "Pending"
        ).length;


    const resolved =
        reports.filter(
            report =>
            report.status === "Resolved"
        ).length;


    const score =
        resolved * 10 +
        total * 2;


    animateNumber(
        "totalReports",
        total
    );


    animateNumber(
        "pendingReports",
        pending
    );


    animateNumber(
        "resolvedReports",
        resolved
    );


    animateNumber(
        "ecoScore",
        score
    );

}



/* ================= COUNTER ANIMATION ================= */

function animateNumber(id, target) {

    const element =
        document.getElementById(id);


    let current = 0;


    const increment =
        Math.max(
            1,
            Math.ceil(target / 20)
        );


    const timer =
        setInterval(function() {

            current += increment;


            if (current >= target) {

                current = target;

                clearInterval(timer);

            }


            element.textContent =
                current;

        }, 25);

}



/* ================= TOAST ================= */

function showToast(message) {

    const toast =
        document.getElementById("toast");


    const text =
        document.getElementById("toastText");


    text.textContent =
        message;


    toast.classList.add("show");


    setTimeout(function() {

        toast.classList.remove("show");

    }, 3000);

}



/* ================= MOBILE MENU ================= */

function toggleMenu() {

    document
        .getElementById("navMenu")
        .classList.toggle("active");

}



/* =====================================================
   AWARENESS DATA
===================================================== */

const awarenessData = {


    reduce: {

        title: "Reduce Waste",

        icon: "fa-arrow-down",

        image:
        "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1000&q=80",

        description:
        "The best waste is the waste we never create. Small changes in daily shopping and consumption can reduce waste significantly.",

        video:
        "https://www.youtube.com/embed/6jQ7y_qQYUA",

        steps: [

            {
                title: "Avoid Single Use",
                text:
                "Avoid disposable plastic bags, cups and bottles."
            },

            {
                title: "Plan Shopping",
                text:
                "Buy only what you actually need."
            },

            {
                title: "Choose Less Packaging",
                text:
                "Prefer products with minimal packaging."
            },

            {
                title: "Use Reusable Items",
                text:
                "Carry reusable bottles, bags and containers."
            }

        ],

        tips: [

            "Carry a reusable water bottle.",

            "Use cloth bags while shopping.",

            "Avoid unnecessary printing.",

            "Plan meals to reduce food waste."

        ],

        dos: [

            "Plan your purchases",

            "Use reusable products",

            "Avoid unnecessary packaging"

        ],

        donts: [

            "Don't buy unnecessary items",

            "Don't depend on single-use plastic",

            "Don't waste food"

        ]

    },


    reuse: {

        title: "Reuse Products",

        icon: "fa-repeat",

        image:
        "https://images.unsplash.com/photo-1604187351574-c75ca79f5807?auto=format&fit=crop&w=1000&q=80",

        description:
        "Before throwing something away, think whether it can be repaired, donated, reused or converted into another useful item.",

        video:
        "https://www.youtube.com/embed/6jQ7y_qQYUA",

        steps: [

            {
                title: "Clean Old Items",
                text:
                "Clean bottles, jars and containers before reuse."
            },

            {
                title: "Repair",
                text:
                "Repair furniture, clothes and electronics when possible."
            },

            {
                title: "Donate",
                text:
                "Give useful clothes, books and products to others."
            },

            {
                title: "Repurpose",
                text:
                "Turn old containers and materials into useful objects."
            }

        ],

        tips: [

            "Donate clothes you no longer use.",

            "Reuse glass jars for storage.",

            "Use old clothes as cleaning cloths.",

            "Repair products instead of replacing them."

        ],

        dos: [

            "Repair products",

            "Donate useful items",

            "Reuse containers"

        ],

        donts: [

            "Don't throw away useful products",

            "Don't replace things unnecessarily",

            "Don't waste reusable materials"

        ]

    },


    recycle: {

        title: "How to Recycle",

        icon: "fa-recycle",

        image:
        "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1000&q=80",

        description:
        "Recycling means collecting and processing used materials so that they can become useful materials or new products.",

        video:
        "https://www.youtube.com/embed/6jQ7y_qQYUA",

        steps: [

            {
                title: "Separate Waste",
                text:
                "Separate recyclable waste from food and other waste."
            },

            {
                title: "Clean Materials",
                text:
                "Remove food and liquid from containers."
            },

            {
                title: "Sort Materials",
                text:
                "Separate paper, plastic, glass and metal according to local rules."
            },

            {
                title: "Send for Recycling",
                text:
                "Give recyclable materials to an appropriate collection centre."
            }

        ],

        tips: [

            "Keep paper and cardboard dry.",

            "Rinse bottles and containers.",

            "Flatten cardboard boxes.",

            "Check your local recycling rules.",

            "Never mix food waste with recyclable materials."

        ],

        dos: [

            "Separate recyclable waste",

            "Clean containers",

            "Keep recyclables dry",

            "Follow local rules"

        ],

        donts: [

            "Don't mix food-covered material",

            "Don't put hazardous waste into normal recycling",

            "Don't assume every plastic is recyclable"

        ]

    },


    plant: {

        title: "Plant More Trees",

        icon: "fa-seedling",

        image:
        "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1000&q=80",

        description:
        "Planting and caring for suitable trees and plants can make communities greener and support local ecosystems.",

        video:
        "https://www.youtube.com/embed/6jQ7y_qQYUA",

        steps: [

            {
                title: "Choose the Right Plant",
                text:
                "Select a plant suitable for your local climate and space."
            },

            {
                title: "Prepare Soil",
                text:
                "Prepare healthy soil before planting."
            },

            {
                title: "Plant Carefully",
                text:
                "Place the sapling at an appropriate depth."
            },

            {
                title: "Care for It",
                text:
                "Water and protect the young plant regularly."
            }

        ],

        tips: [

            "Choose suitable native plants when possible.",

            "Water young plants regularly.",

            "Protect saplings from animals.",

            "Remove weeds around young plants."

        ],

        dos: [

            "Choose suitable plants",

            "Water young plants",

            "Protect saplings",

            "Take care of planted trees"

        ],

        donts: [

            "Don't plant without checking space",

            "Don't neglect young plants",

            "Don't damage existing trees"

        ]

    }

};



/* =====================================================
   OPEN AWARENESS
===================================================== */

function openAwareness(type) {

    const data =
        awarenessData[type];


    const modal =
        document.getElementById(
            "awarenessModal"
        );


    const details =
        document.getElementById(
            "awarenessDetails"
        );


    details.innerHTML = `

        <div class="modal-header">

            <img
                src="${data.image}"
                alt="${data.title}">


            <div class="modal-intro">

                <div class="big-icon">

                    <i class="fa-solid ${data.icon}"></i>

                </div>


                <h2>
                    ${data.title}
                </h2>


                <p>
                    ${data.description}
                </p>

            </div>

        </div>



        <div class="video-section">

            <h3>

                <i class="fa-brands fa-youtube"></i>

                Related Awareness Video

            </h3>


            <iframe
                class="video-frame"
                src="${data.video}"
                title="${data.title} video"
                allowfullscreen>
            </iframe>

        </div>



        <div class="modal-body">

            <h3>

                <i class="fa-solid fa-list-check"></i>

                How To Do It

            </h3>


            <div class="steps">

                ${data.steps.map(
                    function(step,index) {

                    return `

                        <div class="step">

                            <div class="step-number">

                                ${index + 1}

                            </div>


                            <div>

                                <h4>
                                    ${step.title}
                                </h4>

                                <p>
                                    ${step.text}
                                </p>

                            </div>

                        </div>

                    `;

                }).join("")}

            </div>



            <div class="tips-box">

                <h3>

                    <i class="fa-solid fa-lightbulb"></i>

                    Simple Tips

                </h3>


                ${data.tips.map(
                    function(tip) {

                    return `

                        <div class="tip">

                            <i class="fa-solid fa-circle-check"></i>

                            <span>
                                ${tip}
                            </span>

                        </div>

                    `;

                }).join("")}

            </div>



            <div class="do-dont">


                <div class="do-box">

                    <h4>

                        <i class="fa-solid fa-check"></i>

                        Do

                    </h4>


                    <ul>

                        ${data.dos.map(
                            function(item) {

                            return `
                                <li>
                                    ✓ ${item}
                                </li>
                            `;

                        }).join("")}

                    </ul>

                </div>



                <div class="dont-box">

                    <h4>

                        <i class="fa-solid fa-xmark"></i>

                        Don't

                    </h4>


                    <ul>

                        ${data.donts.map(
                            function(item) {

                            return `
                                <li>
                                    ✕ ${item}
                                </li>
                            `;

                        }).join("")}

                    </ul>

                </div>

            </div>

        </div>

    `;


    modal.classList.add("active");


    document.body.style.overflow =
        "hidden";

}



/* ================= CLOSE MODAL ================= */

function closeAwareness() {

    const modal =
        document.getElementById(
            "awarenessModal"
        );


    modal.classList.remove("active");


    document.body.style.overflow =
        "auto";

}



/* ================= OUTSIDE CLICK ================= */

document
    .getElementById("awarenessModal")
    .addEventListener(
        "click",
        function(event) {

            if (
                event.target === this
            ) {

                closeAwareness();

            }

        }
    );



/* ================= ESCAPE ================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Escape"
        ) {

            closeAwareness();

        }

    }
);



/* ================= INITIAL LOAD ================= */

displayReports();

updateDashboard();