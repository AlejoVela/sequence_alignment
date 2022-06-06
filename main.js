let $sendButton = document.getElementById("sendButton");
let $chainOne = document.getElementById("chainOne");
let $chainTwo = document.getElementById("chainTwo");
let $resultChainOne = document.getElementById("resultChainOne");
let $resultChainTwo = document.getElementById("resultChainTwo");
let $resultCoincidence = document.getElementById("resultCoincidence");
let $chainOneLimit1 = document.getElementById("chainOneLimit1");
let $chainOneLimit2 = document.getElementById("chainOneLimit2");
let $chainTwoLimit1 = document.getElementById("chainTwoLimit1");
let $chainTwoLimit2 = document.getElementById("chainTwoLimit2");
let $resultText = document.getElementById("resultText");
let $messageLabel = document.getElementById("messageLabel");
let regularExpression = /^[GCTA]+$/i;
let isLocalAligment = false;
let sameSize = false;
let points = 0;

const GlobalAlignment = (sequenceOne, sequenceTwo, aligment) => {
  let chainOneHtml = "<th>Chain 1</th>";
  let chainTwoHtml = "<th>Chain 2</th>";
  let chainCoincidence = "<th>#</th>";

  for (var i = 0; i < LowestSize(sequenceOne, sequenceTwo); i++) {
    chainOneHtml += `<td>${sequenceOne[i]}</td>`;
    chainTwoHtml += `<td>${sequenceTwo[i]}</td>`;
    if (sequenceOne[i] === sequenceTwo[i]) {
      points++;
      chainCoincidence += `<td class="table-info"></td>`;
    } else {
      chainCoincidence += `<td class="table-danger"></td>`;
    }
  }
  let resultText = `${aligment}\nCantidad de coincidencias: ${points}`; 
  sameSize == true ? resultText += `\nPorcentaje de Similitud ${(points*100)/sequenceOne.length}%` : resultText += "";
  resultText += `\nLogintud cadena 1: ${sequenceOne.length}\nLogintud cadena 2: ${sequenceTwo.length}`
  $resultChainOne.innerHTML = chainOneHtml;
  $resultChainTwo.innerHTML = chainTwoHtml;
  $resultCoincidence.innerHTML = chainCoincidence;
  $resultText.innerText = resultText;
};

const IsLocalAligment = (sequenceOne, sequenceTwo) => {
  let subSequenceOne = sequenceOne.substring($chainOneLimit1.value, parseInt($chainOneLimit2.value) + 1);
  let subSequenceTwo = sequenceTwo.substring($chainTwoLimit1.value, parseInt($chainTwoLimit2.value) + 1);
  subSequenceOne.length == subSequenceTwo.length
    ? (sameSize = true)
    : (sameSize = false);
  GlobalAlignment(subSequenceOne, subSequenceTwo,"Alineamiento Local");
}

const PrintMessage = (message, color) => {
  $messageLabel.innerHTML = message;
  if (color) {
    $messageLabel.style.color = "green";
  } else {
    $messageLabel.style.color = "red";
  }
};

const LowestSize = (chainOne, chainTwo) => {
  let size = chainOne.length > chainTwo.length ? chainTwo.length : chainOne.length;
  return size;
};

const Validations = (sequenceOne, sequenceTwo) => {
  sequenceOne.length == sequenceTwo.length
    ? (sameSize = true)
    : (sameSize = false);
  if(
      $chainOneLimit1.value == "" ||
      $chainOneLimit1.value < 0 ||
      $chainOneLimit1.value > sequenceOne.length ||
      $chainOneLimit2.value == "" ||
      $chainOneLimit2.value < 0 ||
      $chainOneLimit2.value > sequenceOne.length ||
      $chainTwoLimit1.value == "" ||
      $chainTwoLimit1.value < 0 ||
      $chainTwoLimit1.value > sequenceTwo.length ||
      $chainTwoLimit2.value == "" ||
      $chainTwoLimit2.value < 0 ||
      $chainTwoLimit2.value > sequenceTwo.length ||
      $chainOneLimit1.value > $chainOneLimit2.value ||
      $chainTwoLimit1.value > $chainTwoLimit2.value
    ){
      isLocalAligment = false;
    } else {
      isLocalAligment = true;
    }
}

$sendButton.onclick = function () {
  points = 0;
  $messageLabel.innerHTML = "";

  if ($chainOne.value != "" && $chainTwo.value != "") {
    let sequenceOne = $chainOne.value.toUpperCase();
    let sequenceTwo = $chainTwo.value.toUpperCase();
    if (
      regularExpression.test(sequenceOne) &&
      regularExpression.test(sequenceTwo)
    ) {
      Validations(sequenceOne, sequenceTwo);
      isLocalAligment == false ? GlobalAlignment(sequenceOne, sequenceTwo, "Alineamiento Global") : IsLocalAligment(sequenceOne, sequenceTwo);
    } else {
      PrintMessage(
        "GCTA son los unicos caracteres validos para una secuencia",
        false
      );
      console.log("NO PASO!");
    }
  } else {
    PrintMessage("Por favor ingrese las dos secuencias correctamente", false);
  }
};
