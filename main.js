let $sendButton = document.getElementById("sendButton");
let $chainOne = document.getElementById("chainOne");
let $chainTwo = document.getElementById("chainTwo");
let $resultChainOne = document.getElementById("resultChainOne");
let $resultChainTwo = document.getElementById("resultChainTwo");
let $resultCoincidence = document.getElementById("resultCoincidence");
let $resultText = document.getElementById("resultText");
let $messageLabel = document.getElementById("messageLabel");
let regularExpression = /^[GCTA]+$/i;
let sameSize = false;
let points = 0;

const GlobalAlignment = (sequenceOne, sequenceTwo) => {
  //siempre tomar el valor de la menor cadena para el for
  let chainOneHtml = "<th>Chain 1</th>";
  let chainTwoHtml = "<th>Chain 2</th>";
  let chainCoincidence = "<th>#</th>";
  for (var i = 0; i < sequenceOne.length; i++) {
    chainOneHtml += `<td>${sequenceOne[i]}</td>`;
    chainTwoHtml += `<td>${sequenceTwo[i]}</td>`;
    if(sequenceOne[i] === sequenceTwo[i]){
      points++;
      chainCoincidence += `<td class="table-info"></td>`;
    } else {
      chainCoincidence += `<td class="table-danger"></td>`;
    }
  }
  $resultChainOne.innerHTML = chainOneHtml;
  $resultChainTwo.innerHTML = chainTwoHtml;
  $resultCoincidence.innerHTML = chainCoincidence;
  $resultText.innerText = `Cantidad de coincidencias: ${points}`;
}

const PrintMessage = (message, color) =>{
  $messageLabel.innerHTML = message;
  if(color) {
    $messageLabel.style.color = "green";
  } else {
    $messageLabel.style.color = "red";
  }
}

$sendButton.onclick = function () {
  points = 0;
  $messageLabel.innerHTML = "";

  if($chainOne.value != "" && 
    $chainTwo.value != "" 
    )
  {
    let sequenceOne = $chainOne.value.toUpperCase();
    let sequenceTwo = $chainTwo.value.toUpperCase();
    if(regularExpression.test(sequenceOne) && regularExpression.test(sequenceTwo)){
      sequenceOne.length == sequenceTwo.length ? sameSize = true: sameSize = false;
      GlobalAlignment(sequenceOne, sequenceTwo);
    } else {
      PrintMessage("GCTA son los unicos caracteres validos para una secuencia", false)
      console.log("NO PASO!");
    }
  } else {
    PrintMessage("Por favor ingrese las dos secuencias correctamente", false);
  }
}