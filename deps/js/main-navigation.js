let navigationButton = document.getElementById("navigation-button");
let navigationMenu = document.getElementById("navigation-menu");
let navigationOpened = false;
let animationShow = "animate-fade-down";
let animationHide = "animate-jump-out";

navigationButton.addEventListener("click", () => {
    navigationOpened = !navigationOpened;
    if(navigationOpened){
        ShowNavigation();
    }else{
        HideNavigation();
    }
})

function ShowNavigation(){
    navigationMenu.classList.add(animationShow)
    navigationMenu.onanimationend = () => {
        navigationMenu.classList.remove(animationShow)
        navigationMenu.onanimationend = null;
    }
    navigationMenu.hidden = false;
}

function HideNavigation(){
    navigationMenu.classList.add(animationHide)
    navigationMenu.onanimationend = () => {
        navigationMenu.hidden = true;
        navigationMenu.onanimationend = null;
        navigationMenu.classList.remove(animationHide)
    }
}