document.addEventListener('DOMContentLoaded', () => {
    let faqSections = document.getElementsByClassName("faq-section");
    for (let i = 0; i < faqSections.length; i++) {
        const section = faqSections[i];
        if(section != null){
            let btns = section.getElementsByClassName("faq-btn");
            let content = section.getElementsByClassName("faq-content");
            let button = btns[0];

            if(button != undefined && content.length > 0){
                let hidden = true;
                let imgDown = button.getElementsByClassName("faq-arrow-down")[0];
                let imgUp = button.getElementsByClassName("faq-arrow-up")[0];

                button.addEventListener("click", () => {
                    let element = content[0];
                    hidden = !hidden;
                    if(hidden){
                        element.classList.add("hidden")
                        button.getAttribute("open-color-class").split(" ").forEach((c) => {
                            button.classList.remove(c);
                        })
                        imgDown.hidden = false;
                        imgUp.hidden = true;
                    }else{
                        element.classList.remove("hidden");
                        button.getAttribute("open-color-class").split(" ").forEach((c) => {
                            button.classList.add(c);
                        })
                        imgDown.hidden = true;
                        imgUp.hidden = false;
                    }
                })
            }
        }
    }
    
});
