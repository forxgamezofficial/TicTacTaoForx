const socket = io();

let mySymbol = null;

let roomId = null;

let gameStarted = false;

const boardElement = document.getElementById("board");
const turnElement = document.getElementById("turn");
const winnerElement = document.getElementById("winner");
const restartBtn = document.getElementById("restart");

let board = [];

let currentPlayer = "X";

let gameOver = false;

let winningCells = [];

const funnyMessages = [

"মুড়ি খা ভাই 😭",
"এই gameplay দেখে WiFi ও কাঁদতেছে 💀",
"তোরে দেখে bot ও হাসতেছে 😂",
"ভাই game না, দোয়া পড় 😭",
"এই move দেখে board নিজেই লজ্জা পাইছে ☠️",
"প্রতিপক্ষ এখন life rethink করতেছে 😂",
"ভাই keyboard উল্টা ধরে খেলতেছ নাকি 💀",
"তোর gameplay দেখে NPC চাকরি ছেড়ে দিছে 😭",
"মনে হয় calculator দিয়ে game খেলতেছ ☠️",
"এই হার official disaster 😭",
"Discord moderator silently watching 👀",
"এই match FBI investigate করবে 💀",
"তুই move দিছস না torture করতেছস 😂",
"Enemy mentally unavailable 😭",
"এই gameplay দেখে chair পর্যন্ত হতাশ ☠️",
"ভাই চোখ খোলা রাখ 😭",
"Opponent uninstall button খুঁজতেছে 😂",
"তুই কি YouTube tutorial skip করছস? 💀",
"Brain loading... 1% ☠️",
"এই match দেখে router suicide দিবে 😭",
"ভাই panic এ move দিতেছে 😂",
"এত খারাপ খেললে board মামলা দিবে 💀",
"তুই move দিছস নাকি accident হইছে 😭",
"Enemy এখন পাহাড়ে চলে যাবে ☠️",
"ভাইরে কেউ coaching দাও 😂",
"এটা gameplay না crime 😭",
"এই move মানবজাতির বিরুদ্ধে ☠️",
"ভাই strategy এর বদলে দোয়া পড়তেছে 😂",
"Opponent emotionally damaged 💀",
"Game ta tore personally hate করে 😭",
"তোর gameplay দেখে mouse disconnect হইছে ☠️",
"ভাই game khelar age ঘুমায় নিস 😂",
"এই match ইতিহাসে কালো দিন 😭",
"তুই move দিছস না experiment করতেছস 💀",
"Opponent bathroom এ কান্দতেছে 😂",
"এত panic কেন ভাই 😭",
"এই gameplay দেখে monitor বন্ধ হইতে চায় ☠️",
"Skill issue premium edition 😂",
"তোর gameplay দেখে electricity চলে গেছে 💀",
"Enemy এখন গ্রামের বাড়ি চলে যাবে 😭",
"এই move দেখে physics fail ☠️",
"ভাই game না chaos চালাইতেছে 😂",
"Opponent life choices rethink করতেছে 💀",
"তুই tutorial এর villain 😭",
"এই gameplay হারাম level dangerous ☠️",
"ভাই move দেয় আর regret করে 😂",
"Board emotionally broken 💀",
"এই match Netflix এ দেওয়া উচিত 😭",
"Opponent এখন monk হবে ☠️",
"তুই game না horror story খেলতেছস 😂",
"এই move দেখে AI চাকরি ছাড়বে 💀",
"ভাইরে দেখে lag ও ভয় পাইছে 😭",
"Opponent আর মানুষ নাই ☠️",
"তোর gameplay দেখে fan বন্ধ হইছে 😂",
"এই match national emergency 💀",
"তুই move দিছস নাকি lottery কাটতেছস 😭",
"Opponent এখন নদীর পাশে বসে আছে ☠️",
"এই gameplay দেখে mobile গরম হয়ে গেছে 😂",
"তোর strategy আল্লাহ ভরসা 💀",
"Opponent এখন motivational speaker 😭",
"এই move pure terrorism ☠️",
"তুই game না meme বানাইতেছস 😂",
"Opponent spiritually destroyed 💀",
"এই match দেখে bird উড়াল দিছে 😭",
"ভাই panic এ oxygen খাইতেছে ☠️",
"এই gameplay দেখে server restart নিতে চায় 😂",
"ভাই game খেলতেছ নাকি আলু কাটতেছ 😭",
"এই gameplay দেখে router পালাইতে চায় 💀",
"তুই move দিলি নাকি earthquake হইলো ☠️",
"Opponent এখন জানালার বাইরে তাকাইয়া আছে 😂",
"এই match দেখে পাখিরাও চুপ 😭",
"তোর gameplay দেখে বিদ্যুৎও shock খাইছে 💀",
"ভাই এত panic ক্যান 😭",
"এই move দেখে board depression এ গেছে ☠️",
"তুই strategy না lottery চালাস 😂",
"Opponent এখন মসজিদে দোয়া চাইতেছে 💀",
"এই gameplay দেখে mouse retirement নিতে চায় 😭",
"ভাই move দেওয়ার আগে Google করে আয় ☠️",
"Enemy এখন আত্মীয়দের কাছে support চাইতেছে 😂",
"এই হারে জাতি হতাশ 💀",
"তুই game না magic দেখাইতেছস 😭",
"Opponent emotionally expired ☠️",
"এই gameplay দেখে monitor গরম হয়ে গেছে 😂",
"ভাই game এ ঢুকেই disaster শুরু করছস 💀",
"এই move illegal in ১৯টা দেশ 😭",
"তুই move না random generator চালাস ☠️",
"Opponent এখন জীবন নিয়ে ভাবতেছে 😂",
"এই gameplay দেখে internet slow হয়ে গেছে 💀",
"তোর strategy pure confusion 😭",
"ভাই game টারে personally offend করছস ☠️",
"Opponent এখন bamboo খুঁজতেছে 😂",
"এই match দেখে moonwalk দিতে ইচ্ছা করতেছে 💀",
"তুই move দিলেই chaos শুরু হয় 😭",
"এই gameplay দেখে fan ঘুরা বন্ধ করছে ☠️",
"Opponent এখন motivational reel বানাবে 😂",
"এই move pure black magic 💀",
"তুই game খেলস না experiment চালাস 😭",
"এই match দেখে AI পর্যন্ত ভয় পাইছে ☠️",
"Opponent এখন চা খাইয়া শান্ত হইতেছে 😂",
"তোর gameplay দেখে দেয়ালও হাসতেছে 💀",
"ভাই এত lag brain এ নাকি game এ 😭",
"এই হার ইতিহাস বইয়ে যাবে ☠️",
"Opponent এখন গ্রামের বাড়ি চলে গেছে 😂",
"এই gameplay দেখে server কাঁপতেছে 💀",
"তুই move দিলেই physics fail হয় 😭",
"এই match দেখে calculator hang ☠️",
"Opponent এখন নদীর পাশে বসে আছে 😂",
"তোর gameplay দেখে বিড়ালও cringe খাইছে 💀",
"ভাই move না doom launch করতেছস 😭",
"এই হার NASA observe করতেছে ☠️",
"Opponent এখন life reset দিতে চায় 😂",
"এই gameplay দেখে বাতাস বন্ধ 💀",
"তুই move দিলে board কষ্ট পায় 😭",
"এই match দেখে neighbour complain করছে ☠️",
"Opponent এখন পাহাড়ে meditation করতেছে 😂",
"তোর gameplay দেখে mobile charge কমে গেছে 💀",
"ভাই এত খারাপ খেললে police আসবে 😭",
"এই move দেখে game uninstall নিতে চায় ☠️",
"Opponent এখন বালিশে মুখ লুকাইছে 😂",
"এই gameplay দেখে mouse battery শেষ 💀",
"তুই move না accident ঘটাস 😭",
"এই match দেখে doctor ডাকতে হবে ☠️",
"Opponent এখন emotional damage phase এ 😂",
"তোর gameplay দেখে internet disconnect 💀",
"ভাই game টারে respect দে 😭",
"এই হার cinematic universe level ☠️",
"Opponent এখন জানে না সে কে 😂",
"তুই move দিলেই disaster alert আসে 💀",
"এই gameplay দেখে পৃথিবী থেমে গেছে 😭",
"Opponent এখন oxygen নিচ্ছে ☠️",
"তোর gameplay দেখে keyboard কাঁদতেছে 😂",
"এই match pure comedy show 💀",
"ভাই এত troll move কইরা লাভ কি 😭",
"Opponent এখন therapy লাগবে ☠️",
"এই gameplay দেখে clock বন্ধ হয়ে গেছে 😂",
"তুই move দিলেই server panic করে 💀",
"Opponent এখন village arc এ গেছে 😭",
"এই match দেখে ghost ও ভয় পাইছে ☠️",
"তোর gameplay দেখে চা ঠান্ডা হয়ে গেছে 😂",
"ভাই এত random কেন 😭",
"Opponent এখন গরুর সাথে কথা বলতেছে ☠️",
"এই gameplay দেখে fridge open হইছে 😂",
"তুই move দিলেই universe glitch করে 💀",
"ভাই move দিছস নাকি ডিম ভাজতেছ 😭",
"এই gameplay দেখে পাশের বাসার মানুষও কাঁদতেছে 💀",
"তোর brain ping 9999 ☠️",
"Opponent এখন ceiling এর দিকে তাকায়া আছে 😂",
"এই match দেখে গরুও হতাশ 😭",
"ভাই এত ভুল move accidental নাকি talent 💀",
"এই gameplay দেখে chair চাকরি ছাড়ছে ☠️",
"Opponent এখন নিজের নাম ভুলে গেছে 😂",
"তুই move দিলেই WiFi weak হয় 💀",
"এই হার আন্তর্জাতিক লজ্জা 😭",
"ভাই game না earthquake simulator চালাইতেছ ☠️",
"Opponent এখন চুপচাপ দেয়াল দেখতেছে 😂",
"এই gameplay দেখে internet modem কাঁদছে 💀",
"তুই কি চোখ বন্ধ কইরা খেলতেছ 😭",
"Opponent এখন জীবন নিয়ে TED Talk দিবে ☠️",
"এই move দেখে moonwalk দিতে ইচ্ছা করতেছে 😂",
"তোর gameplay দেখে battery ১% হয়ে গেছে 💀",
"ভাই move দিলেই tragedy music বাজে 😭",
"Opponent এখন নৌকায় করে দূরে চলে যাইতে চায় ☠️",
"এই gameplay দেখে রাস্তার কুকুরও হাসতেছে 😂",
"তুই move না curse ছাড়তেছস 💀",
"এই match দেখে laptop fan চিৎকার দিছে 😭",
"Opponent এখন চা খাইয়া trauma recover করতেছে ☠️",
"তোর gameplay দেখে Discord crash নিতে চায় 😂",
"ভাই game এ ঢুকেই violence শুরু করছস 💀",
"এই move দেখে Einstein logout নিছে 😭",
"Opponent এখন bamboo forest এ meditation করতেছে ☠️",
"তোর gameplay দেখে bird migrate করছে 😂",
"এই match দেখে fan spin বন্ধ 💀",
"ভাই এত chaos কোথায় শিখছস 😭",
"Opponent এখন dark mode life এ গেছে ☠️",
"এই gameplay দেখে মোবাইল vibrate দিচ্ছে 😂",
"তুই move দিলেই thunderstorm শুরু হয় 💀",
"Opponent এখন মাঠে হাওয়া খাইতেছে 😭",
"এই match দেখে history বই rewrite হবে ☠️",
"তোর gameplay দেখে পাশের রুমে কান্না শুরু 😂",
"ভাই game টারে torture কইরো না 💀",
"Opponent এখন আলু ব্যবসা শুরু করবে 😭",
"এই gameplay দেখে physics resign দিছে ☠️",
"তুই move দিলেই reality bend হয় 😂",
"Opponent এখন নদীতে পাথর ছুড়তেছে 💀",
"এই হার emotional damage premium 😭",
"ভাই strategy না random prayer দিছস ☠️",
"Opponent এখন নিজের shadow কেও trust করে না 😂",
"এই gameplay দেখে clock backward যাইতেছে 💀",
"তুই move দিলেই gravity বন্ধ হয় 😭",
"Opponent এখন bed এ face down ☠️",
"এই match দেখে বিড়ালও silent 😂",
"ভাই এত panic করলে oxygen লাগবে 💀",
"Opponent এখন motivational page খুলছে 😭",
"এই gameplay দেখে fridge ও হতাশ ☠️",
"তুই কি calculator এর AI নাকি 😂",
"Opponent এখন পাহাড়ে গিয়ে goat এর সাথে থাকবো ভাবতেছে 💀",
"এই match দেখে পৃথিবী lag করছে 😭",
"ভাই move না doom button চাপতেছ ☠️",
"Opponent এখন life uninstall দিতে চায় 😂",
"তোর gameplay দেখে browser freeze 💀",
"এই match দেখে চা পর্যন্ত bitter 😭",
"Opponent এখন গাছের দিকে তাকাইয়া meaning খুঁজতেছে ☠️",
"তুই move দিলেই universe buffering শুরু করে 😂",
"এই gameplay দেখে পানি পর্যন্ত শুকায় গেছে 💀",
"ভাই এত risky move দিলে ambulance লাগবে 😭",
"Opponent এখন নিজের reflection কেও ভয় পায় ☠️",
"এই match দেখে NASA confused 😂",
"তুই move দিলেই internet airplane mode এ যায় 💀",
"Opponent এখন pillow hug কইরা বসে আছে 😭",
"এই gameplay দেখে keyboard overheating ☠️",
"ভাই move দেওয়ার আগে আয়না দেখ 😭",
"Opponent এখন গ্রামের মাঠে দৌড়াইতেছে 😂",
"এই match দেখে সূর্যও dim হয়ে গেছে 💀",
"তুই move না boss fight শুরু করতেছ 😭",
"Opponent এখন লুঙ্গি পরে শান্তি খুঁজতেছে ☠️",
"এই gameplay দেখে মাছও পানির নিচে cringe খাইছে 😂",
"তোর strategy দেখে calculator আত্মহত্যা করছে 💀",
"Opponent এখন নিজের নাম change করতে চায় 😭",
"এই match দেখে mosquito পর্যন্ত silent ☠️",
"তুই move দিলেই chair পিছাই যায় 😂",
"Opponent এখন YouTube এ “how to recover mentally” search দিচ্ছে 💀",
"ভাই game খেলতেছ নাকি বাসন মাজতেছ 😭",
"Opponent এখন ceiling fan এর সাথে eye contact করছে 💀",
"তোর gameplay দেখে রাস্তার বিড়ালও হতাশ ☠️",
"এই move pure certified disaster 😂",
"ভাই এত miss কেমনে করস 😭",
"Opponent এখন বালিশ কামড়ায়া বসে আছে 💀",
"এই gameplay দেখে keyboard warranty শেষ ☠️",
"তুই move দিলেই internet dua পড়ে 😂",
"Opponent এখন রিকশায় বসে life ভাবতেছে 💀",
"এই match দেখে পাখিরাও migrate করছে 😭",
"ভাই game এ ঢুকেই criminal activity শুরু ☠️",
"Opponent এখন silent mode এ গেছে 😂",
"এই gameplay দেখে চিপসও নরম হয়ে গেছে 💀",
"তুই move না meteor ফেলতেছ 😭",
"Opponent এখন village side quest এ ☠️",
"এই match দেখে monitor blink দিচ্ছে 😂",
"ভাই এত random move কে শেখাইছে 💀",
"Opponent এখন চা ছাড়া বাঁচতে পারবে না 😭",
"এই gameplay দেখে physics teacher resign ☠️",
"তুই move দিলেই air conditioner কাঁপে 😂",
"Opponent এখন motivational song শুনতেছে 💀",
"এই হার direct emotional damage 😭",
"ভাই game না circus চালাইতেছ ☠️",
"Opponent এখন হাঁসের দিকে তাকাইয়া শান্তি খুঁজতেছে 😂",
"এই gameplay দেখে laptop fan scream করছে 💀",
"তুই move দিলেই WiFi timeout নেয় 😭",
"Opponent এখন নিজের shadow ignore করছে ☠️",
"এই match দেখে সময় থেমে গেছে 😂",
"ভাই এত panic দিলে oxygen cylinder লাগবে 💀",
"Opponent এখন bamboo field এ দৌড়াইতেছে 😭",
"এই gameplay দেখে toaster ও লজ্জা পাইছে ☠️",
"তুই move দিলেই Google confused হয় 😂",
"Opponent এখন pillow fight একাই খেলতেছে 💀",
"এই match দেখে calculator uninstall নিছে 😭",
"ভাই strategy এর বদলে astrology use করতেছ ☠️",
"Opponent এখন গ্রামের চায়ের দোকানে বসে আছে 😂",
"এই gameplay দেখে বিদ্যুৎ চলে যেতে চায় 💀",
"তুই move দিলেই chair পিছলাই যায় 😭",
"Opponent এখন নদীর মাছের সাথে কথা বলতেছে ☠️",
"এই match দেখে moon disappear 😂",
"ভাই এত troll move দিলে মামলা হবে 💀",
"Opponent এখন fridge খুলে stare করতেছে 😭",
"এই gameplay দেখে internet provider চাকরি ছাড়বে ☠️",
"তুই move দিলেই পৃথিবী rotate slow হয় 😂",
"Opponent এখন জানালার পাশে dramatic pose দিছে 💀",
"এই match দেখে পাশের বাসা relocate করতে চায় 😭",
"ভাই game টারে personally attack কইরো না ☠️",
"Opponent এখন tutorial baby হয়ে গেছে 😂",
"এই gameplay দেখে battery নিজেই drain 💀",
"তুই move দিলেই universe update নেয় 😭",
"Opponent এখন goat farming শুরু করবে ☠️",
"এই match দেখে mosquito bite বন্ধ করছে 😂",
"ভাই এত lag brain এ কেন 💀",
"Opponent এখন লুঙ্গি পরে মাঠে হাঁটতেছে 😭",
"এই gameplay দেখে remote control কাজ বন্ধ ☠️",
"তুই move দিলেই gravity confused হয় 😂",
"Opponent এখন নিজের নাম change করতে চায় 💀",
"এই match দেখে AI পর্যন্ত cry করছে 😭",
"ভাই game না horror movie বানাইতেছ ☠️",
"Opponent এখন wall এর সাথে কথা বলতেছে 😂",
"এই gameplay দেখে পানি পর্যন্ত গরম 💀",
"তুই move দিলেই clouds disappear 😭",
"Opponent এখন meditation app download দিচ্ছে ☠️",
"এই match দেখে fan reverse ঘুরতেছে 😂",
"ভাই এত unlucky কেমনে হও 💀",
"Opponent এখন মাঠে শুয়ে আকাশ দেখতেছে 😭",
"এই gameplay দেখে internet cable পালাইতে চায় ☠️",
"তুই move দিলেই chair cry করে 😂",
"Opponent এখন নিজের হাতকেই blame দিচ্ছে 💀",
"এই match দেখে ইতিহাস rewrite হবে 😭",
"ভাই এত cursed gameplay কেন ☠️",
"Opponent এখন গ্রামের গরুর সাথে bonding করছে 😂",
"এই gameplay দেখে mobile airplane mode এ গেছে 💀",
"তুই move দিলেই doom music বাজে 😭",
"Opponent এখন 404 mentally not found ☠️",
"এই match দেখে chicken fry ও burnt 😂",
"ভাই game টারে respect দে একটু 💀",
"Opponent এখন হাওয়া খাইতে rooftop এ গেছে 😭",
"এই gameplay দেখে door lock নিজে বন্ধ ☠️",
"তুই move দিলেই internet reboot নেয় 😂",
"Opponent এখন dark room এ বসে আছে 💀",
"এই match দেখে সূর্যও hide নিচ্ছে 😭",
"ভাই এত chaos একা সামলানো যায় না ☠️",
"ভাই তোর gameplay দেখে ইবলিসও অবাক 😭",
"Opponent এখন বাঁশঝাড়ে শান্তি খুঁজতেছে 💀",
"এই move দেখে WiFi router নামাজে গেছে ☠️",
"তুই move দিলেই universe autosave নেয় 😂",
"Opponent এখন ডাব খাইয়া recover করতেছে 💀",
"এই gameplay দেখে Google Chrome hang 😭",
"ভাই game খেলতেছ নাকি গরু চরাইতেছ ☠️",
"Opponent এখন নিজের জন্মসনদ খুঁজতেছে 😂",
"এই match দেখে battery suicide দিছে 💀",
"তুই move দিলেই room temperature বাড়ে 😭",
"Opponent এখন গ্রামের পুকুরের পাশে বসে আছে ☠️",
"এই gameplay দেখে headphone খুলে ফেলতে ইচ্ছা করে 😂",
"ভাই এত dangerous move কোথায় শিখছস 💀",
"Opponent এখন mosquito slap কইরা stress কমাইতেছে 😭",
"এই match দেখে browser incognito তে গেছে ☠️",
"তুই move দিলেই earthquake alert আসে 😂",
"Opponent এখন pillow throw করতেছে 💀",
"এই gameplay দেখে রিকশাও উল্টা ঘুরতেছে 😭",
"ভাই strategy এর বদলে তাবিজ use কর ☠️",
"Opponent এখন চায়ের কাপের দিকে তাকায়া silent 💀",
"এই move দেখে NASA laptop বন্ধ করছে 😂",
"তুই move দিলেই CPU temperature ৯০° 😭",
"Opponent এখন life skip ad খুঁজতেছে ☠️",
"এই gameplay দেখে fan এরও depression 😂",
"ভাই game টারে এত কষ্ট দিস না 💀",
"Opponent এখন বৃষ্টির দিকে তাকায়া emotional 😭",
"এই match দেখে internet cable গিঁট খাইছে ☠️",
"তুই move দিলেই monitor sigh দেয় 😂",
"Opponent এখন নিজের shadow block দিছে 💀",
"এই gameplay দেখে toothpaste ও শুকায় গেছে 😭",
"ভাই এত panic দিলে ambulance premium লাগবে ☠️",
"Opponent এখন গরুর সাথে emotional bonding করছে 😂",
"এই match দেখে পাশের বাসার wifi weak 💀",
"তুই move দিলেই fridge vibration দেয় 😭",
"Opponent এখন tutorial baby mode এ ☠️",
"এই gameplay দেখে ceiling fan reverse spin 😂",
"ভাই এত cursed energy কোথা থেকে আসে 💀",
"Opponent এখন motivational status দিচ্ছে 😭",
"এই match দেখে calculator airplane mode এ ☠️",
"তুই move দিলেই thunder sound আসে 😂",
"Opponent এখন মাঠে barefoot হাঁটতেছে 💀",
"এই gameplay দেখে internet provider কাঁদতেছে 😭",
"ভাই game খেলতেছ নাকি black magic করতেছ ☠️",
"Opponent এখন নিজের হাত blame করতেছে 😂",
"এই move দেখে wall crack হইতে চায় 💀",
"তুই move দিলেই gravity resign দেয় 😭",
"Opponent এখন চুপচাপ rice খাইতেছে ☠️",
"এই gameplay দেখে light flicker করছে 😂",
"ভাই এত random move science explain করতে পারবে না 💀",
"Opponent এখন নদীর পানিতে পাথর মারতেছে 😭",
"এই match দেখে chicken fry raw হয়ে গেছে ☠️",
"তুই move দিলেই mobile heat warning দেয় 😂",
"Opponent এখন গ্রামের মাঠে meditation করছে 💀",
"এই gameplay দেখে keyboard Ctrl+Alt+Del চাইতেছে 😭",
"ভাই এত unlucky হওয়া আইনত অপরাধ ☠️",
"Opponent এখন বাতাসের সাথে কথা বলতেছে 😂",
"এই match দেখে neighbour internet off করছে 💀",
"তুই move দিলেই system restore লাগে 😭",
"Opponent এখন mirror avoid করতেছে ☠️",
"এই gameplay দেখে alarm clockও বন্ধ 😂",
"ভাই game টারে trauma দিস না 💀",
"Opponent এখন silent cry mode এ 😭",
"এই match দেখে AI factory বন্ধ ☠️",
"তুই move দিলেই CPU fan scream করে 😂",
"Opponent এখন গ্রামের tea stall এ বসে আছে 💀",
"এই gameplay দেখে bird GPS হারাইছে 😭",
"ভাই এত cursed gameplay Netflix এ যাওয়া উচিত ☠️",
"Opponent এখন pillow এর নিচে মুখ লুকাইছে 😂",
"এই match দেখে mosquito migrate করছে 💀",
"তুই move দিলেই internet reconnect নেয় 😭",
"Opponent এখন নিজের নাম forgot password দিছে ☠️",
"এই gameplay দেখে charger spark করছে 😂",
"ভাই game খেলতে এসে natural disaster বানাইছস 💀",
"Opponent এখন bamboo therapy নিচ্ছে 😭",
"এই match দেখে পৃথিবী buffering ☠️",
"তুই move দিলেই reality update লাগে 😂",
"Opponent এখন চুপচাপ আকাশ দেখতেছে 💀",
"এই gameplay দেখে Discord নিজেই mute 😭",
"ভাই এত troll move দিলে আদালত ডাকবে ☠️",
"Opponent এখন emotional support goat চাইতেছে 😂",
"এই match দেখে fridge lightও dim 💀",
"তুই move দিলেই lag increase হয় 😭",
"Opponent এখন নিজের keyboard এর সাথে ঝগড়া করতেছে ☠️",
"এই gameplay দেখে router factory বন্ধ 😂"

];

function randomFunnyMessage(){

  return funnyMessages[
    Math.floor(Math.random() * funnyMessages.length)
  ];

}

function createBoard(){

  board = [];

  for(let r=0;r<5;r++){

    const row = [];

    for(let c=0;c<5;c++){

      row.push("");

    }

    board.push(row);
  }
}

function drawBoard(){

  boardElement.innerHTML = "";

  for(let r=0;r<5;r++){

    for(let c=0;c<5;c++){

      const cell = document.createElement("div");

      cell.classList.add("cell");

      cell.innerText = board[r][c];

      if(board[r][c] === "X"){
        cell.classList.add("x");
      }

      if(board[r][c] === "O"){
        cell.classList.add("o");
      }

      const isWinningCell = winningCells.some(
        ([wr,wc]) => wr === r && wc === c
      );

      if(isWinningCell){

        cell.style.background = "#00ff88";

        cell.style.color = "black";

        cell.style.boxShadow =
        "0 0 20px #00ff88";
      }

      cell.addEventListener("click",()=>{

        makeMove(r,c);

      });

      boardElement.appendChild(cell);
    }
  }
}

function makeMove(r,c){

if(!gameStarted) return;

if(gameOver) return;

if(currentPlayer !== mySymbol) return;

if(board[r][c] !== "") return;



socket.emit("move",{
roomId,
r,
c,
player:mySymbol
});
}

function checkWin(player){

  winningCells = [];

  // horizontal
  for(let r=0;r<5;r++){

    for(let c=0;c<=1;c++){

      if(
        board[r][c] === player &&
        board[r][c+1] === player &&
        board[r][c+2] === player &&
        board[r][c+3] === player
      ){

        winningCells = [
          [r,c],
          [r,c+1],
          [r,c+2],
          [r,c+3]
        ];

        return true;
      }
    }
  }

  // vertical
  for(let c=0;c<5;c++){

    for(let r=0;r<=1;r++){

      if(
        board[r][c] === player &&
        board[r+1][c] === player &&
        board[r+2][c] === player &&
        board[r+3][c] === player
      ){

        winningCells = [
          [r,c],
          [r+1,c],
          [r+2,c],
          [r+3,c]
        ];

        return true;
      }
    }
  }

  // diagonal right
  for(let r=0;r<=1;r++){

    for(let c=0;c<=1;c++){

      if(
        board[r][c] === player &&
        board[r+1][c+1] === player &&
        board[r+2][c+2] === player &&
        board[r+3][c+3] === player
      ){

        winningCells = [
          [r,c],
          [r+1,c+1],
          [r+2,c+2],
          [r+3,c+3]
        ];

        return true;
      }
    }
  }

  // diagonal left
  for(let r=0;r<=1;r++){

    for(let c=3;c<5;c++){

      if(
        board[r][c] === player &&
        board[r+1][c-1] === player &&
        board[r+2][c-2] === player &&
        board[r+3][c-3] === player
      ){

        winningCells = [
          [r,c],
          [r+1,c-1],
          [r+2,c-2],
          [r+3,c-3]
        ];

        return true;
      }
    }
  }

  return false;
}

restartBtn.addEventListener("click",()=>{

    socket.emit(
        "restart",
        roomId
    );

});

createBoard();

drawBoard();

socket.on("waiting",()=>{

winnerElement.innerText =
"Waiting for opponent...";

});

socket.on("gameStart",(data)=>{

mySymbol = data.symbol;
roomId = data.roomId;

gameStarted = true;

currentPlayer = data.firstTurn;

turnElement.innerText =
"Turn: " + currentPlayer;

winnerElement.innerText =
"You are " + mySymbol;

drawBoard();

});



socket.on("restart",()=>{

    createBoard();

    currentPlayer = "X";

    gameOver = false;

    winningCells = [];

    winnerElement.innerText = "";

    turnElement.innerText =
    "Turn: X";

    drawBoard();

});

socket.on("opponentLeft",()=>{

    gameStarted = false;

    winnerElement.innerText =
    "Opponent disconnected 😢";

});

socket.on("move", (data) => {

    board[data.r][data.c] = data.player;

    if (checkWin(data.player)) {

        drawBoard();

        winnerElement.innerText =
            data.player +
            " জিতছে 😂 | " +
            randomFunnyMessage();

        gameOver = true;
        return;
    }

    currentPlayer = data.nextTurn;

    turnElement.innerText =
        "Turn: " + currentPlayer;

    drawBoard();

});


