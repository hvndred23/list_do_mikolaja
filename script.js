
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxGLvwaLxuqJIxMHYnm4DkCZnAxnqOfDo4ab_m12sN05-tSMULPYWVpEdzOpXeXyDXONA/exec";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("letterForm");

    if (!form) {
        console.error("Nie znaleziono formularza o ID letterForm.");
        return;
    }

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const letterField = document.getElementById("letter");
        const categoryField = document.getElementById("wish");
        const consentField = document.getElementById("consent");
        const websiteField = document.getElementById("website");

        const letter = letterField?.value.trim() || "";
        const category = categoryField?.value || "";

        // Ochrona antyspamowa
        if (websiteField && websiteField.value.trim() !== "") {
            return;
        }

        // Sprawdzenie treści listu
        if (!letter || letter.length < 10) {
            showMessage("Napisz list o długości co najmniej 10 znaków.", "error");
            return;
        }

        if (letter.length > 5000) {
            showMessage("Twój list jest za długi. Maksymalnie 5000 znaków.", "error");
            return;
        }

        // Sprawdzenie kategorii
        if (!category) {
            showMessage("Wybierz kategorię swojego marzenia.", "error");
            return;
        }

        // Sprawdzenie zgody
        if (consentField && !consentField.checked) {
            showMessage("Zaznacz zgodę przed wysłaniem listu.", "error");
            return;
        }

        const submitButton = document.getElementById("submitButton");
        const buttonText = document.getElementById("buttonText");
        const originalButtonText = buttonText?.textContent;

        if (submitButton) {
            submitButton.disabled = true;
        }

        if (buttonText) {
            buttonText.textContent = "Wysyłanie...";
        }

        // Dane wysyłane do Google Apps Script
        const formData = new URLSearchParams();
        formData.append("letter", letter);
        formData.append("wish", category);

        try {
            await fetch(GOOGLE_SCRIPT_URL, {
                method: "POST",
                mode: "no-cors",
                body: formData
            });

            showMessage(
                "Dziękujemy! Twój list został wysłany! 🎅 Sprawdź arkusz Google, aby potwierdzić zapis.",
                "success"
            );

            form.reset();

            // Wyzerowanie licznika znaków, jeśli istnieje
            const charCount = document.getElementById("charCount");
            if (charCount) {
                charCount.textContent = "0";
            }

        } catch (error) {
            console.error("Błąd wysyłania listu:", error);

            showMessage(
                "Nie udało się wysłać listu. Spróbuj ponownie później.",
                "error"
            );

        } finally {
            if (submitButton) {
                submitButton.disabled = false;
            }

            if (buttonText) {
                buttonText.textContent = originalButtonText || "Wyślij list do Mikołaja";
            }
        }
    });
});

function showMessage(message, type) {
    const messageBox = document.getElementById("statusMessage");

    if (!messageBox) {
        console.error("Nie znaleziono elementu statusMessage.");
        return;
    }

    messageBox.textContent = message;
    messageBox.className = `form-message ${type}`;
}
