const counters = document.querySelectorAll(".stat-card h2");

counters.forEach(counter => {
    const updateCounter = () => {
        const target = parseFloat(counter.innerText);
        let current = 0;

        const increment = target / 100;

        const timer = setInterval(() => {
            current += increment;

            if (current >= target) {
                counter.innerText = target;
                clearInterval(timer);
            } else {
                counter.innerText = Math.floor(current);
            }
        }, 20);
    };

    updateCounter();
});