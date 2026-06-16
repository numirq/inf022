const rootNode = document.body;
const config = { childList: true, subtree: true };
const delayClassName = "scranim-delay:";
const animationClassNames = ["scranim:", "scroll-animation:",]
const baseChildAnimationClassNames = ["*:scranim:", "*:scroll-animation:",]
const allChildAnimationClassNames = ["**:scranim:", "**:scroll-animation:",]
const animationUpClassName = "scranimup:"
const baseChildAnimationUpClassNames = ["*:scranimup:", "*:scroll-animation-up:",]

class AnimationNode {
    constructor(element, animationName, delay, animationUpName) {
        this.element = element;
        this.animationName = animationName;
        this.delay = delay;
        if(isNaN(delay)){
            delay = 0;
        }
        this.animationUpName = animationUpName;
        this.ySort = null;
        this.played = false;
    }
}

let animationNodes = [];
let baseChildAnimationNodes = [];
let allChildAnimationNodes = [];

let lastScrollTop = 0;
let scrollDelta = 0;

function isInViewport(element) {
    let bounding = element.getBoundingClientRect();
    return (
        bounding.top <= window.visualViewport.height &&
        bounding.top >= -bounding.height
    );
}

window.addEventListener("load", () => {
    setupNodes();
    const observer = new MutationObserver(callback);
    observer.observe(rootNode.firstChild, config);
    lastScrollTop = window.scrollY <= 0 ? 0 : window.scrollY;
    scrollDelta = -1;              
    scrollUpdate();
    document.addEventListener("scroll", (event) => {
        scrollDelta = lastScrollTop - window.scrollY;
        scrollUpdate();
        lastScrollTop = window.scrollY <= 0 ? 0 : window.scrollY;
    })  
})

function scrollUpdate(){
    animationNodes.forEach(animNode =>{
        let element = animNode.element;
        let inViewport = isInViewport(element);
        if(inViewport && animNode.played == false){
            animNode.played = true;
            setTimeout(() => {
                // Scrolling up:
                if (scrollDelta > 0) {
                    if(typeof animNode.animationUpName === "string"){
                        element.classList.add(animNode.animationUpName);
                        return;        
                    }
                } // Scrolling down:
                else if(scrollDelta < 0){
                    element.classList.add(animNode.animationName);
                }
            }, animNode.delay);
        }else if(!inViewport && typeof animNode.animationUpName === "string"){
            element.classList.remove(animNode.animationUpName);
            element.classList.remove(animNode.animationName);
            animNode.played = false
        }
    })
}

const callback = (mutationsList, observer) => {
  for (let mutation of mutationsList) {
    if (mutation.type === "childList") {
      mutation.addedNodes.forEach(node => {
        // next reavaluate
      });
    }
  }
};

function setupNodes(){
    rootNode.querySelectorAll('*').forEach(element => {
        animationLevel = 0;
        let animationNode;
        element.classList.forEach(str => {
            animationClassNames.forEach(animationName => {
                if(str.startsWith(animationName)){
                    animationNode = new AnimationNode(element, str.slice(animationName.length), 0);
                    animationNodes.push(animationNode);
                    animationLevel = 1;
                    return;
                }
            })

            baseChildAnimationClassNames.forEach(animationName => {
                if(str.startsWith(animationName)){
                    animationNode = new AnimationNode(element, str.slice(animationName.length), 0);
                    baseChildAnimationNodes.push(animationNode);
                    return;
                }
            })

            baseChildAnimationUpClassNames.forEach(animationName => {
                if(str.startsWith(animationName)){
                    animationNode = new AnimationNode(element, null, 0, str.slice(animationName.length));
                    baseChildAnimationNodes.push(animationNode);
                    return;
                }
            })
            
            allChildAnimationClassNames.forEach(animationName => {
                if(str.startsWith(animationName)){
                    animationNode = new AnimationNode(element, str.slice(animationName.length), 0);
                    allChildAnimationNodes.push(animationNode);
                    return;
                }
            })

            if(str.startsWith(animationUpClassName)){
                animationNode.animationUpName = str.slice(animationUpClassName.length);
            }
            
            if(str.startsWith(delayClassName)){
                let delayStr = str.slice(delayClassName.length);
                let delayFloat = parseFloat(delayStr);
                if(!isNaN(delayFloat)){
                    animationNode.delay = delayFloat;
                }else{
                    animationNode.delay = 0;
                }
            }
        })
    });

    if(baseChildAnimationNodes.length > 0){
        baseChildAnimationNodes.forEach((animNode) => {
            if(animNode != null && animNode != undefined){
                animNode.element.childNodes.forEach((node) => {
                    if(node instanceof HTMLElement){
                        animationNodes.push(new AnimationNode(node, animNode.animationName, 0, animNode.animationUpName));
                    }
                })
            }
        })
    }

    if(allChildAnimationNodes.length > 0){
        allChildAnimationNodes.forEach((animNode) => {
            if(animNode != null && animNode != undefined){
                animNode.element.childNodes.querySelectorAll("*").forEach((node) => {
                    if(node instanceof HTMLElement){
                        animationNodes.push(new AnimationNode(node, animNode.animationName, 0, animNode.animationUpName));
                    }
                })
            }
        })
    }
}