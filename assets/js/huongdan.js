(function () {
  document.querySelectorAll(".faq-question").forEach((question) => {
    function toggleQuestion() {
      const item = question.closest(".faq-item");
      if (!item) return;
      const expanded = item.classList.toggle("active");
      question.setAttribute("aria-expanded", String(expanded));
      const answerId = question.getAttribute("aria-controls");
      const answer = answerId ? document.getElementById(answerId) : null;
      if (answer) answer.setAttribute("aria-hidden", String(!expanded));
    }

    question.addEventListener("click", toggleQuestion);
  });
})();
