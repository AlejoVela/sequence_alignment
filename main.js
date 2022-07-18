let $sendButton = document.getElementById("sendButton");
let $chainOne = document.getElementById("chainOne");
let $chainTwo = document.getElementById("chainTwo");
let $textOne = document.getElementById("textOne");
let $textTwo = document.getElementById("textTwo");
let $resultChainOne = document.getElementById("resultChainOne");
let $resultChainTwo = document.getElementById("resultChainTwo");
let $resultCoincidence = document.getElementById("resultCoincidence");
let $chainOneLimit1 = document.getElementById("chainOneLimit1");
let $chainOneLimit2 = document.getElementById("chainOneLimit2");
let $chainTwoLimit1 = document.getElementById("chainTwoLimit1");
let $chainTwoLimit2 = document.getElementById("chainTwoLimit2");
let $resultText = document.getElementById("resultText");
let $messageLabel = document.getElementById("messageLabel");
var $snackbar = document.getElementById("snackbar");
let regularExpression = /^[GCTAN]{1,60}$/i;
let completeChain = "";
let isLocalAlignment = false;
let sameSize = false;
let points = 0;
let contentTextFile = "";
let organism1 = "";
let organism2 = "";


const readFile = async (file) => {
  let result = await new Promise((resolve) => {
    let fileReader = new FileReader();
    fileReader.onload = (e) => resolve(fileReader.result);
    fileReader.readAsText(file);
  });
  return result;
}

const GlobalAlignment = (sequenceOne, sequenceTwo, alignment) => {
  let localSizeChainOne = sequenceOne.length;
  let localSizeChainTwo = sequenceTwo.length;
  let chainOneHtml = "<th>Chain 1</th>";
  let chainTwoHtml = "<th>Chain 2</th>";
  let chainCoincidence = "<th>#</th>";
  let size = DefineLowestChain(sequenceOne, sequenceTwo);
  if (sequenceOne.length != sequenceTwo.length) {
    sequenceOne.length > sequenceTwo.length
      ? (sequenceTwo += completeChain)
      : (sequenceOne += completeChain);
  }
  for (var i = 0; i < size; i++) {
    chainOneHtml += `<td>${sequenceOne[i]}</td>`;
    chainTwoHtml += `<td>${sequenceTwo[i]}</td>`;
    if (sequenceOne[i] === sequenceTwo[i]) {
      points++;
      chainCoincidence += `<td class="table-info"></td>`;
    } else {
      chainCoincidence += `<td class="table-danger"></td>`;
    }
  }
  let resultText = `${alignment}\nCantidad de coincidencias: ${points}`;
  sameSize == true
    ? (resultText += `\nPorcentaje de Similitud ${
        (points * 100) / sequenceOne.length
      }%`)
    : (resultText += "");
  resultText += `\nLogintud cadena 1: ${$chainOne.value.length}\nLogintud cadena 2: ${$chainTwo.value.length}`;
  isLocalAlignment == true
    ? (resultText += `\nLogintud local cadena 1: ${localSizeChainOne}\nLogintud local cadena 2: ${localSizeChainTwo}`)
    : (resultText += "");
  if(organism1 != "" && organism2 != "")
    resultText += `\nOrganismo cadena 1: ${organism1}\nOrganismo cadena 2: ${organism2}`

    isLocalAlignment == true
    ? PrintWithSnackBar(
        "Exito!", 
        "Alineamiento Local Exitoso!",
        "success", 
        6000
      )
    : PrintWithSnackBar(
        "Exito!", 
        "Alineamiento global Exitoso!",
        "success", 
        6000
      );
  $resultChainOne.innerHTML = chainOneHtml;
  $resultChainTwo.innerHTML = chainTwoHtml;
  $resultCoincidence.innerHTML = chainCoincidence;
  $resultText.innerText = resultText;
};

const IsLocalAlignment = (sequenceOne, sequenceTwo) => {
  let subSequenceOne = sequenceOne.substring(
    $chainOneLimit1.value,
    parseInt($chainOneLimit2.value) + 1
  );
  let subSequenceTwo = sequenceTwo.substring(
    $chainTwoLimit1.value,
    parseInt($chainTwoLimit2.value) + 1
  );
  subSequenceOne.length == subSequenceTwo.length
    ? (sameSize = true)
    : (sameSize = false);
  GlobalAlignment(subSequenceOne, subSequenceTwo, "Alineamiento Local");
};

const PrintMessage = (message, color) => {
  $messageLabel.innerHTML = message;
  if (color) {
    $messageLabel.style.color = "DarkGoldenRod";
  } else {
    $messageLabel.style.color = "red";
  }
};

const DefineLowestChain = (chainOne, chainTwo) => {
  let lowestSize = LowestSize(chainOne, chainTwo);
  let highestSize = HighestSize(chainOne, chainTwo);
  completeChain = "";
  for (let i = 0; i < highestSize - lowestSize; i++) {
    completeChain += " ";
  }

  return highestSize;
};

const LowestSize = (chainOne, chainTwo) => {
  let size =
    chainOne.length > chainTwo.length ? chainTwo.length : chainOne.length;
  return size;
};
const HighestSize = (chainOne, chainTwo) => {
  let size =
    chainOne.length > chainTwo.length ? chainOne.length : chainTwo.length;
  return size;
};

const Validations = (sequenceOne, sequenceTwo) => {
  sequenceOne.length == sequenceTwo.length
    ? (sameSize = true)
    : (sameSize = false);

  if (
    $chainOneLimit1.value != "" ||
    $chainOneLimit2.value != "" ||
    $chainTwoLimit1.value != "" ||
    $chainTwoLimit2.value != ""
  ) {
    if (
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
    ) {
      if($chainOneLimit1.value > $chainOneLimit2.value ||
        $chainTwoLimit1.value > $chainTwoLimit2.value){
          PrintWithSnackBar(
            "Advertencia para realizar un alineamiento local", 
            "Para realizar un alineamiento local," + 
            "<br>las posiciones de inicio deben ser <br>"+
            "menores a las posiciones finales" +
            "<br>para ambas cadenas",
            "warning", 
            6000
            )
            PrintMessage(
                "Para realizar un alineamiento local las posiciones de inicio deben ser menores a las posiciones finales para ambas cadenas." + 
                "\nAdicionalmente, todos los campos deben estar correctamente diligenciados.\nMientras las posiciones sean incorrectas, el alineamiento se hará de forma global de manera predeterminada", 
                true
              );
        } else {
          PrintWithSnackBar(
            "Advertencia para realizar un alineamiento local", 
            "Para realizar un alineamiento local," + 
            "<br>Asegurese de que las posiciones esten correctamente" + 
            "<br>diligenciadas para ambas cadenas.",
            "warning", 
            6000
            )
        }

      isLocalAlignment = false;
    } else {
      isLocalAlignment = true;
    }
  } else {
    isLocalAlignment = false;
  }
};

const PrintWithSnackBar = (title, message, type, time) => {
  $snackbar.innerHTML = `${title}<hr>${message}`;
  $snackbar.className = `show ${type}`;

  setTimeout(function () {
    $snackbar.className = $snackbar.className.replace("show", "");
    $snackbar.className = $snackbar.className.replace("danger", "");
    $snackbar.className = $snackbar.className.replace("success", "");
    $snackbar.className = $snackbar.className.replace("warning", "");
  }, time);
};

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
      isLocalAlignment == false
        ? GlobalAlignment(sequenceOne, sequenceTwo, "Alineamiento Global")
        : IsLocalAlignment(sequenceOne, sequenceTwo);
    } else {
      PrintMessage(
        "GCTA son los unicos caracteres validos para una secuencia", 
        false
      );
      PrintWithSnackBar(
        "Error en las cadenas ingresadas", 
        "GCTA son los unicos caracteres validos para una secuencia" + 
        "<br>Ademas, estas deben tener una longitud de máximo 60 nucleotidos",
        "danger", 
        6000
        )
    }
  } else {
    PrintMessage("Por favor ingrese las dos secuencias correctamente", false);
    PrintWithSnackBar(
      "Error en las cadenas ingresadas", 
      "Por favor ingrese las dos secuencias correctamente",
      "danger", 
      6000
      )
  }
};

const BlockFields = () => {
  $chainOne.setAttribute("disabled", "true");
  $chainTwo.setAttribute("disabled", "true");
}

$textOne.oninput = async function () {
  contentTextFile = await readFile($textOne.files[0]);
  let selectTextChain = contentTextFile.split("\n");
  $chainOne.value = selectTextChain[1].substring(0, 60);
  organism1 = selectTextChain[0].split("|")[4];

  BlockFields();
  console.log(selectTextChain);
}

$textTwo.oninput = async function () {
  contentTextFile = await readFile($textTwo.files[0]);
  let selectTextChain = contentTextFile.split("\n");
  $chainTwo.value = selectTextChain[1].substring(0, 60);
  organism2 = selectTextChain[0].split("|")[4];

  BlockFields();
  console.log(contentTextFile);
}