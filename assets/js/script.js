const handleHamburgerMenuClick = e => {
    const target_id = e.currentTarget.getAttribute('data-target')
    const target = document.getElementById(target_id)

    // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
    e.currentTarget.classList.toggle('is-active')
    target.classList.toggle('is-active')
}

function themeToggle() {
    document.body.classList.toggle("dark");
}

function init() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.remove("light");
        document.body.classList.add("dark");
    } else {
        document.body.classList.remove("dark");
        document.body.classList.add("light");
    }
}
window.onload=init;