const form = document.querySelector("#login-form");
const message = document.querySelector("#login-message");

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.querySelector("#login-email").value.trim();
    const password = document.querySelector("#login-password").value.trim();

    message.textContent = "";

    if (!email || !password) {
      message.textContent = "Please fill in all fields.";
      message.style.color = "red";
      return;
    }

    try {
      message.textContent = "Logging in...";
      message.style.color = "var(--color-black)";

      const response = await fetch("https://v2.api.noroff.dev/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.errors?.[0]?.message || "Login failed");
      }

      const userData = data.data;

      localStorage.setItem("accessToken", userData.accessToken);
      localStorage.setItem("user", JSON.stringify(userData));

      message.textContent = "Login successful! Please wait...";
      message.style.color = "var(--color-green)";

      form.reset();

      setTimeout(() => {
        window.location.href = "index.html";
      }, 1500);

    } catch (error) {
      message.textContent = error.message;
      message.style.color = "var(--color-red)";
    }
  });
}