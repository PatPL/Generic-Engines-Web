var ListName = "Unnamed";
let MainEngineTable: HtmlTable;

addEventListener ("DOMContentLoaded", () => {
    //Disable default RMB context menu
    //document.addEventListener('contextmenu', event => event.preventDefault());
    
    //Disable option image dragging (user-select: none; doesn't do it)
    let images = document.querySelectorAll<HTMLElement> (".option-button");
    images.forEach (image => {
        image.ondragstart = () => { return false; }
    });
    
    document.getElementById ("option-button-new")!.addEventListener ("click", NewButton_Click);
    document.getElementById ("option-button-open")!.addEventListener ("click", OpenButton_Click);
    document.getElementById ("option-button-append")!.addEventListener ("click", AppendButton_Click);
    document.getElementById ("option-button-save")!.addEventListener ("click", SaveButton_Click);
    document.getElementById ("option-button-validate")!.addEventListener ("click", ValidateButton_Click);
    document.getElementById ("option-button-export")!.addEventListener ("click", ExportButton_Click);
    document.getElementById ("option-button-duplicate")!.addEventListener ("click", DuplicateButton_Click);
    document.getElementById ("option-button-add")!.addEventListener ("click", AddButton_Click);
    document.getElementById ("option-button-remove")!.addEventListener ("click", RemoveButton_Click);
    
    document.getElementById ("option-button-settings")!.addEventListener ("click", SettingsButton_Click);
    document.getElementById ("option-button-help")!.addEventListener ("click", HelpButton_Click);
    
    let ListNameDisplay = new EditableField (window, "ListName", document.getElementById ("list-name")!);
    
    //=
    
    MainEngineTable = new HtmlTable (document.getElementById ("list-container")!);
    
    for (let i = 0; i < 8; ++i) {
        MainEngineTable.Items.push (new Engine ());
    }
    
    (<Engine> MainEngineTable.Items[1]).Gimbal.AdvancedGimbal = true;
    (<Engine> MainEngineTable.Items[1]).Gimbal.GimbalNX = 3;
    (<Engine> MainEngineTable.Items[1]).Gimbal.GimbalPX = 6;
    (<Engine> MainEngineTable.Items[1]).Gimbal.GimbalNY = 9;
    (<Engine> MainEngineTable.Items[1]).Gimbal.GimbalPY = 12;
    
    (<Engine> MainEngineTable.Items[2]).Labels.EngineName = "Custom Name";
    (<Engine> MainEngineTable.Items[2]).Labels.EngineManufacturer = "R";
    (<Engine> MainEngineTable.Items[2]).Labels.EngineDescription = `Mój stary to fanatyk wędkarstwa. Pół mieszkania zajebane wędkami najgorsze. Średnio raz w miesiącu ktoś wdepnie w leżący na ziemi haczyk czy kotwicę i trzeba wyciągać w szpitalu bo mają zadziory na końcu. W swoim 22 letnim życiu już z 10 razy byłem na takim zabiegu. Tydzień temu poszedłem na jakieś losowe badania to baba z recepcji jak mnie tylko zobaczyła to kazała buta ściągać xD bo myślała, że znowu hak w nodze.

    Druga połowa mieszkania zajebana Wędkarzem Polskim, Światem Wędkarza, Super Karpiem xD itp. Co tydzień ojciec robi objazd po wszystkich kioskach w mieście, żeby skompletować wszystkie wędkarskie tygodniki. Byłem na tyle głupi, że nauczyłem go into internety bo myślałem, że trochę pieniędzy zaoszczędzimy na tych gazetkach ale teraz nie dosyć, że je kupuje to jeszcze siedzi na jakichś forach dla wędkarzy i kręci gównoburze z innymi wędkarzami o najlepsze zanęty itp. Potrafi drzeć mordę do monitora albo wypierdolić klawiaturę za okno. Kiedyś ojciec mnie wkurwił to założyłem tam konto i go trolowałem pisząc w jego tematach jakieś losowe głupoty typu karasie jedzo guwno. Matka nie nadążała z gotowaniem bigosu na uspokojenie. Aha, ma już na forum rangę SUM, za najebanie 10k postów."
    
    "Jak jest ciepło to co weekend zapierdala na ryby. Od jakichś 5 lat w każdą niedzielę jem rybę na obiad a ojciec pierdoli o zaletach jedzenia tego wodnego gówna. Jak się dostałem na studia to stary przez tydzień pie**olił że to dzięki temu, że jem dużo ryb bo zawierają fosfor i mózg mi lepiej pracuje.
    
    Co sobotę budzi ze swoim znajomym mirkiem całą rodzinę o 4 w nocy bo hałasują pakując wędki, robiąc kanapki itd.
    
    Przy jedzeniu zawsze pierdoli o rybach i za każdym razem temat schodzi w końcu na Polski Związek Wędkarski, ojciec sam się nakręca i dostaje strasznego bólu dupy durr niedostatecznie zarybiajo tylko kradno hurr, robi się przy tym cały czerwony i odchodzi od stołu klnąc i idzie czytać Wielką Encyklopedię Ryb Rzecznych żeby się uspokoić.
    
    W tym roku sam sobie kupił na święta ponton. Oczywiście do wigilii nie wytrzymał tylko już wczoraj go rozpakował i nadmuchał w dużym pokoju. Ubrał się w ten swój cały strój wędkarski i siedział cały dzień w tym pontonie na środku mieszkania. Obiad (karp) też w nim zjadł [cool][cześć]
    
    Gdybym mnie na długość ręki dopuścili do wszystkich ryb w polsce to bym wziął i zapierdolił.
    
    Jak któregoś razu, jeszcze w podbazie czy gimbazie, miałem urodziny to stary jako prezent wziął mnie ze sobą na ryby w drodze wyjątku. Super prezent kurwo.
    
    Pojechaliśmy gdzieś wpizdu za miasto, dochodzimy nad jezioro a ojcu już się oczy świecą i oblizuje wargi podniecony. Rozłożył cały sprzęt i siedzimy nad woda i patrzymy na spławiki. Po pięciu minutach mi się znudziło więc włączyłem discmana to mnie ojciec pierdolnął wędką po głowie, że ryby słyszą muzykę z moich słuchawek i się płoszą. Jak się chciałem podrapać po dupie to zaraz 'krzyczał szeptem', żebym się nie wiercił bo szeleszczę i ryby z wody widzą jak się ruszam i uciekają. 6 godzin musiałem siedzieć w bezruchu i patrzeć na wodę jak w jakimś jebanym Guantanamo. Urodziny mam w listopadzie więc jeszcze do tego było zimno jak sam skurwysyn. W pewnym momencie ojciec odszedł kilkanaście metrów w las i się spierdział. Wytłumaczył mi, że trzeba w lesie pierdzieć bo inaczej ryby słyszą i czują.
    
    Wspomniałem, że ojciec ma kolegę mirka, z którym jeździ na ryby. Kiedyś towarzyszem wypraw rybnych był hehe Zbyszek. Człowiek o kształcie piłki z wąsem i 365 dni w roku w kamizelce BOMBER. Byli z moim ojcem prawie jak bracia, przychodził z żoną Bożeną na wigilie do nas itd. Raz ojciec miał imieniny zbysio przyszedł na hehe kielicha. Najebali się i oczywiście cały czas gadali o wędkowaniu i rybach. Ja siedziałem u siebie w pokoju. W pewnym momencie zaczeli drzeć na siebie mordę, czy generalnie lepsze są szczupaki czy sumy.`;
    
    (<Engine> MainEngineTable.Items[3]).Visuals.ModelID = Model.Skipper;
    (<Engine> MainEngineTable.Items[3]).Visuals.PlumeID = Plume.Hypergolic_Lower;
    
    (<Engine> MainEngineTable.Items[1]).TestFlight.RatedBurnTime = 240;
    (<Engine> MainEngineTable.Items[2]).TestFlight.EnableTestFlight = true;
    (<Engine> MainEngineTable.Items[3]).TestFlight.EnableTestFlight = true;
    (<Engine> MainEngineTable.Items[3]).TestFlight.RatedBurnTime = 240;
    
    (<Engine> MainEngineTable.Items[1]).FuelRatios.Items.push ([Fuel.NTO, 4]);
    (<Engine> MainEngineTable.Items[2]).FuelRatios.Items.push ([Fuel.ElectricCharge, 60]);
    (<Engine> MainEngineTable.Items[3]).FuelRatios.Items.push ([Fuel.LqdOxygen, 2]);
    (<Engine> MainEngineTable.Items[3]).FuelRatios.Items.push ([Fuel.ElectricCharge, 800]);
    
    (<Engine> MainEngineTable.Items[1]).Tank.UseTanks = true;
    
    (<Engine> MainEngineTable.Items[2]).Tank.UseTanks = true;
    (<Engine> MainEngineTable.Items[2]).Tank.LimitTanks = true;
    (<Engine> MainEngineTable.Items[2]).Tank.TanksVolume = 0;
    (<Engine> MainEngineTable.Items[2]).Tank.TanksContents.push ([Fuel.Kerosene, 5000]);
    
    (<Engine> MainEngineTable.Items[3]).Tank.UseTanks = true;
    (<Engine> MainEngineTable.Items[3]).Tank.LimitTanks = true;
    (<Engine> MainEngineTable.Items[3]).Tank.TanksVolume = 3000;
    (<Engine> MainEngineTable.Items[3]).Tank.TanksContents.push ([Fuel.Kerosene, 5000]);
    
    (<Engine> MainEngineTable.Items[4]).Tank.UseTanks = true;
    (<Engine> MainEngineTable.Items[4]).Tank.LimitTanks = true;
    (<Engine> MainEngineTable.Items[4]).Tank.TanksVolume = 9000;
    (<Engine> MainEngineTable.Items[4]).Tank.TanksContents.push ([Fuel.Kerosene, 5000]);
    
    (<Engine> MainEngineTable.Items[5]).Tank.UseTanks = true;
    (<Engine> MainEngineTable.Items[5]).Tank.LimitTanks = true;
    (<Engine> MainEngineTable.Items[5]).Tank.TanksVolume = 3000;
    (<Engine> MainEngineTable.Items[5]).Tank.TanksContents.push ([Fuel.Kerosene, 2000]);
    (<Engine> MainEngineTable.Items[5]).Tank.TanksContents.push ([Fuel.NitrousOxide, 200000]);
    
    (<Engine> MainEngineTable.Items[6]).Tank.UseTanks = true;
    (<Engine> MainEngineTable.Items[6]).Tank.LimitTanks = true;
    (<Engine> MainEngineTable.Items[6]).Tank.TanksVolume = 9000;
    (<Engine> MainEngineTable.Items[6]).Tank.TanksContents.push ([Fuel.Kerosene, 5000]);
    (<Engine> MainEngineTable.Items[6]).Tank.TanksContents.push ([Fuel.NitrousOxide, 200000]);
    
    (<Engine> MainEngineTable.Items[7]).Tank.UseTanks = true;
    (<Engine> MainEngineTable.Items[7]).Tank.LimitTanks = false;
    (<Engine> MainEngineTable.Items[7]).Tank.TanksContents.push ([Fuel.Kerosene, 5324]);
    (<Engine> MainEngineTable.Items[7]).Tank.TanksContents.push ([Fuel.NitrousOxide, 242400]);
    (<Engine> MainEngineTable.Items[7]).Tank.TanksContents.push ([Fuel.Helium, 1242400]);
    
    MainEngineTable.ColumnsDefinitions = HtmlTable.AutoGenerateColumns (new Engine ());
    
    MainEngineTable.RebuildTable ();
    
});

function NewButton_Click () {
    MainEngineTable.Items = [];
    MainEngineTable.RebuildTable ();
}

function OpenButton_Click () {
    
}

function AppendButton_Click () {
    
}

function SaveButton_Click () {
    
}

function ValidateButton_Click () {
    
}

function ExportButton_Click () {
    
}

function DuplicateButton_Click () {
    
}

function AddButton_Click () {
    MainEngineTable.AddItem (new Engine ());
}

function RemoveButton_Click () {
    MainEngineTable.RemoveSelectedItems ();
}

function SettingsButton_Click () {
    
}

function HelpButton_Click () {
    
}
