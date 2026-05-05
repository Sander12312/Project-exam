const form = document.querySelector("#register-form");
const message = document.querySelector("#register-message");

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.querySelector("#register-name").value.trim();
    const email = document.querySelector("#register-email").value.trim();
    const password = document.querySelector("#register-password").value.trim();

    message.textContent = "";

    if (!name || !email || !password) {
      message.textContent = "Please fill in all fields.";
      message.style.color = "var(--color-red)";
      return;
    }

    if (!/^[A-Za-z0-9_]+$/.test(name)) {
      message.textContent = "Name can only contain letters, numbers and underscore.";
      message.style.color = "var(--color-red)";
      return;
    }

    if (!email.endsWith("@stud.noroff.no")) {
      message.textContent = "Use a stud.noroff.no email";
      message.style.color = "var(--color-red)";
      return;
    }

    if (password.length < 8) {
      message.textContent = "Password must be at least 8 characters";
      message.style.color = "var(--color-red)";
      return;
    }

    try {
      message.textContent = "Creating user...";
      message.style.color = "var(--color-black)";

      const response = await fetch("https://v2.api.noroff.dev/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.errors?.[0]?.message || "Something went wrong");
      }

      message.textContent = "User created! Redirecting...";
      message.style.color = "var(--color-green)";

      form.reset();

      setTimeout(() => {
        window.location.href = "login.html";
      }, 1500);

    } catch (error) {
      message.textContent = error.message;
      message.style.color = "var(--color-red)";
    }
  });
}