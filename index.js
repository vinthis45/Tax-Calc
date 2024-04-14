$(document).ready(function () {
  $('[data-toggle="tooltip"]').tooltip();

  $("#taxCalculatorForm").submit(function (event) {
    event.preventDefault();
    let grossIncome = parseFloat($("#grossIncome").val());
    let extraIncome = parseFloat($("#extraIncome").val());
    let ageGroup = parseInt($("#ageGroup").val());
    let deductions = parseFloat($("#totalDeductions").val()); // Update ID here

    let totalIncome = calculateTotalIncome(
      grossIncome,
      extraIncome,
      ageGroup,
      deductions
    );

    $("#resultModal .modal-body").html(`
      <div class="text-center">
        <h2>Your overall income will be</h2>
        <p>${totalIncome.toFixed(2)}</p>
        <p class="text-muted">after tax deductions</p>
      </div>
`);
    $("#resultModal").modal("show");
  });

  function calculateTotalIncome(
    grossIncome,
    extraIncome,
    ageGroup,
    deductions
  ) {
    if (isNaN(deductions)) {
      deductions = 0;
    }
    if (isNaN(extraIncome)) {
      extraIncome = 0;
    }
    let totalIncome = grossIncome + extraIncome - deductions;

    if (totalIncome <= 800000) {
      return totalIncome;
    } else {
      let taxableAmount = totalIncome - 800000;
      let taxRate;

      if (ageGroup === 1) {
        taxRate = 0.3;
      } else if (ageGroup === 2) {
        taxRate = 0.4;
      } else {
        taxRate = 0.1;
      }

      let taxAmount = taxableAmount * taxRate;
      return totalIncome - taxAmount;
    }
  }

  // Error for number fields
  $('input[type="text"]').on("input", function () {
    let inputValue = $(this).val();
    if (!($.isNumeric(inputValue) && inputValue >= 0) || inputValue === "") {
      $(this).next(".error-icon").addClass("show");
    } else {
      $(this).next(".error-icon").removeClass("show");
    }
  });
});

$(document).ready(function () {
  $("#ageGroup").val("");
});

$(document).ready(function () {
  $(".submit-button").prop("disabled", true);

  function validateForm() {
    let isValid = true;
    $('input[type="text"], select').each(function () {
      if ($(this).hasClass("required") && $(this).val().trim() === "") {
        isValid = false;
        return false;
      }
      if ($(this).is('input[type="text"]')) {
        let inputValue = $(this).val();
        if (!($.isNumeric(inputValue) || inputValue === "")) {
          isValid = false;
          return false;
        }
      }
    });

    return isValid;
  }

  function updateSubmitButton() {
    if (validateForm()) {
      $(".submit-button").prop("disabled", false);
    } else {
      $(".submit-button").prop("disabled", true);
    }
  }

  $('input[type="text"], select, #totalDeductions').on(
    "input change",
    function () {
      console.log("Input changed");
      updateSubmitButton();
    }
  );
});
