const listAudioDefault = [
  { audio: "notification.mp3" },
  { audio: "notifiFood.mp3" },
];
let selectedVolumeAudio = 1;

window.addEventListener("DOMContentLoaded", async () => {
  const widthPrint = [
    ["140px", "44 mm"],
    ["170px", "57 mm"],
    ["200px", "58 mm"],
    ["250px", "65 mm"],
    ["280px", "77 mm"],
    ["300px", "80 mm"],
  ];
  const listPrinters = document.getElementById("list_printers");
  const listWith = document.getElementById("list_Width");
  const listAudio = document.getElementById("list_audio");
  const volumeAudio = document.getElementById("volume");
  const printDefault = document.getElementById("print-default");
  const printSilent = document.getElementById("printSilent");
  const printAuto = document.getElementById("printAuto");
  const buttonTestSound = document.getElementById("button-test-sound");
  const autoOrderConfirmation = document.getElementById(
    "autoOrderConfirmation"
  );
  const visualPrint = document.getElementById("visualPrint");
  const activeAudio = document.getElementById("active-audio");
  const bntBack = document.getElementById("bnt-back");
  const bntSalveConfig = document.getElementById("bnt-salveConfig");
  const selectAudio = document.getElementById("list_audio");

  let selectPrinterName;
  let selectWidthPage;
  let selectAudioDefault;

  // Buscar no storage configuração impressora padrão
  const {
    printerName,
    widthPage,
    silent,
    auto,
    preview,
    automaticOrderConfirmation,
  } = await window.indexBridge.getDefaultPrinters();

  // Buscar no storage o audio padrão e o volume
  const sound = await window.indexBridge.getDefaultAudio();

  printDefault.innerText = `Padrão: ${printerName}`;
  printSilent.checked = silent;
  printAuto.checked = auto;
  visualPrint.checked = preview;
  autoOrderConfirmation.checked = automaticOrderConfirmation;
  activeAudio.checked = sound.active;
  volumeAudio.value = sound.volume * 100;

  // GET: Lista de todas as impressora do sistema do computador
  const printers = await window.indexBridge.servicePrinterList();

  // Criar um lista das impressora no Layout
  for (const print of printers) {
    const checked = print.name === printerName ? "checked" : "";
    listPrinters.innerHTML += `<input ${checked} type="radio" id="printer_${print.name}" name="printer" value="${print.name}" /> <label for="printer_${print.name}">${print.name}</label><br>`;
  }

  // Criar um lista das largura no Layout
  for (const wPrint of widthPrint) {
    const [valuePX, valueMM] = wPrint;
    const checked = valuePX === widthPage ? "checked" : "";
    listWith.innerHTML += `<input ${checked}  type="radio" id="w_${valuePX}" name="width-print" value="${valuePX}"> <label for="w_${valuePX}">${valueMM}</label><br>`;
  }
  // Inserir os audio disponíveis
  for (const audio of listAudioDefault) {
    const selected = audio.audio === sound.audio ? "selected" : "";
    listAudio.innerHTML += `<option id="op_${audio.audio}" ${selected} value="${audio.audio}">${audio.audio}</option>`;
  }

  // Monitorar a alteração do range do volume
  volumeAudio.addEventListener("change", () => {
    selectedVolumeAudio = volumeAudio.value / 100;
  });

  // Fechar a janela configuração
  bntBack.addEventListener("click", () => window.top.close());

  // Salvar as configurações
  bntSalveConfig.addEventListener("click", () => {
    const nodeListPrint = document.getElementsByName("printer");
    const nodeListWidthPrint = document.getElementsByName("width-print");

    selectAudioDefault = selectAudio.options[selectAudio.selectedIndex].value;
    // Percorrer a lista de impressora e verificar qual o usuário escolheu
    for (const item of nodeListPrint) {
      if (item.checked) {
        selectPrinterName = item.value;
        break;
      }
    }
    // Percorrer a lista de largura e verificar qual o usuário escolheu
    for (const item of nodeListWidthPrint) {
      if (item.checked) {
        selectWidthPage = item.value;
        break;
      }
    }

    const dataSettingPrinter = {
      printerName: selectPrinterName,
      widthPage: selectWidthPage,
      silent: printSilent.checked,
      auto: printAuto.checked,
      preview: visualPrint.checked,
      automaticOrderConfirmation: autoOrderConfirmation.checked,
    };

    const dataSettingAudio = {
      active: activeAudio.checked,
      volume: selectedVolumeAudio,
      audio: selectAudioDefault,
    };

    window.indexBridge.saveDefaultAudio(dataSettingAudio);
    window.indexBridge.saveSettingPrinters(dataSettingPrinter);
    window.top.close(); //Fechar a janela
  });

  //Clicar no botão testar som
  buttonTestSound.addEventListener("click", async () => {
    selectAudioDefault = selectAudio.options[selectAudio.selectedIndex].value;
    buttonTestSound.innerText = "Ouvindo";
    await window.indexBridge
      .emitAlertSound(selectAudioDefault)
      .then(() => (buttonTestSound.innerText = "TESTAR"));
  });
});
