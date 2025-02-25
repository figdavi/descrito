const DEFAULT_GEN_CONTEXT = {
    language: "en",
    mode: "alt",
    condition: "unlabeled-images"
};

function seti18nMessages() {
    const i18nElements = document.querySelectorAll("[data-i18n]");

    i18nElements.forEach((elem) => {
        if(elem instanceof HTMLImageElement) {
            elem.alt = chrome.i18n.getMessage(elem.dataset.i18n) || elem.alt;
        } else {
            elem.innerText = chrome.i18n.getMessage(elem.dataset.i18n) || elem.innerText;
        }
    });
}

function setOptionsToStorage() {
    const isEnabled = document.getElementById("enable-extension").checked;

    const genContext = {
        language: document.getElementById("language").value,
        mode: document.querySelector("input[name='gen-mode-option']:checked").value,
        condition: document.querySelector("input[name='gen-condition-option']:checked").value
    };
    chrome.storage.sync.set({ isEnabled });
    chrome.storage.sync.set({ genContext });
}

async function setOptionsToHTML() {
    const isEnabledData = await chrome.storage.sync.get("isEnabled");
    const isEnabled = isEnabledData.isEnabled ?? true;
    
    document.getElementById("enable-extension").checked = isEnabled;

    const genContextData = await chrome.storage.sync.get("genContext");
    const genContext = genContextData.genContext

    if(!genContext) {
        return;
    }

    document.getElementById("language").value = genContext.language || DEFAULT_GEN_CONTEXT.language;
    document.querySelector(`input[name="gen-mode-option"][value='${genContext.mode || DEFAULT_GEN_CONTEXT.mode}']`).checked = true;
    document.querySelector(`input[name="gen-condition-option"][value='${genContext.condition || DEFAULT_GEN_CONTEXT.language}']`).checked = true;
}

async function main() {
    seti18nMessages();

    // popup opened
    setOptionsToHTML();

    // options changed
    document.body.addEventListener("change", setOptionsToStorage);
}

main();