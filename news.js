// ---- ニュース（公式発表・本人発言・報道・噂） ----
// d: 記事が出た日 "YYYY-MM-DD"（米国の日付）。2026年の分は「知識はここまで」より後だと中身を折りたたむ。
// k: off=公式発表 / self=本人発言 / rep=報道（専門メディアが取材として報じたもの） / rum=噂（未確認。いわゆるダートシートの情報も含む）
// t: 見出し。ぱっと見で結果や筋書きが分からない書き方にする（Xのティーザーと同じ考え方）
// b: 本文。元記事を写さず、自分の言葉で短く要約する。直接の引用は15語以内の一言だけ
// tags: 話題（絞り込みのチップになる） / who: 関係する選手（英語名。選手ページにつながる）
// src: [[媒体名（元の情報源）, URL]] / res: 噂の答え合わせ open=未確定 hit=当たり miss=外れ part=一部当たり、rn: 答え合わせのメモ
// safe: 1 にすると「知識はここまで」より後でも折りたたまない（会場・日程など、筋書きに関係しない話だけ）
const NEWS = [
{id:"n-wm43-announce", d:"2025-09-12", k:"off", t:"レッスルマニア43の開催地はサウジアラビアのリヤド",
 b:"WWEが記者会見で、2027年のレッスルマニア43をサウジアラビアのリヤドで開くと発表。トリプルHとサウジ側のトゥルキ・アルシャイフ氏が登壇した。北米の外で開かれる初めてのレッスルマニアになる。会見ではアンダーテイカーやショーン・マイケルズも顔を見せた。",
 tags:["レッスルマニア43","大会・日程"], who:["Triple H","The Undertaker","Shawn Michaels"],
 src:[["CBS Sports","https://www.cbssports.com/wwe/news/wwe-wrestlemania-43-location-landmark-event-set-to-take-place-in-saudi-arabia-in-2027"],["Wikipedia（英語）","https://en.wikipedia.org/wiki/WrestleMania_43"]]},

{id:"n-rock-raffi", d:"2026-01-21", k:"self", t:"ザ・ロック、サウジでのレッスルマニアに含みを持たせる",
 b:"ザ・ロック本人がインタビュー番組「Raffi Talks」で、サウジで開かれるレッスルマニアについて質問され、大会にもサウジにもワクワクしていると話した。話し合いについては「いい感じだ」とだけ答え、出場するかどうかは明言しなかった。",
 tags:["レッスルマニア43","ザ・ロック"], who:["The Rock"],
 src:[["Solowrestling（Raffi Talksでの発言を紹介）","https://solowrestling.com/us/new/146872-the-rock-leaves-the-door-open-for-wrestlemania-43-in-saudi-arabia"]]},

{id:"n-wm43-date", d:"2026-04-23", k:"rum", t:"レッスルマニア43の日程、狙いは3月末か4月中旬か",
 b:"レスルボーツ（WrestleVotes）によると、WWEは2027年3月27日の週末を狙っていて、4月10日の週末も候補。1夜開催に戻す案もあるが、放送するESPNは2夜開催を望んでいるとファイトフルが伝えた。NXTのスタンド・アンド・デリバーは、サウジでは開かない見込みという。",
 tags:["レッスルマニア43","大会・日程"], who:[],
 src:[["WrestleVotes Radio／Fightful Select（Wrestling Incが紹介）","https://www.wrestlinginc.com/2155566/wwe-wrestlemania-43-nxt-stand-deliver-2027/"]],
 res:"open", rn:"10月中旬の時点で、WWEは日程を正式に発表していない。"},

{id:"n-rock-backup", d:"2026-06-02", k:"rum", t:"ザ・ロックが出ない場合の「代わりの大一番」の噂",
 b:"YouTuberのセルフ・メイド・プロが、WWE内部の人から聞いた話として「ザ・ロックがレッスルマニアに出ないなら、ローマン・レインズ対オバ・フェミを考えている」と話した。本人も、まだ決まっていないことが多いと付け加えている。",
 tags:["レッスルマニア43","ザ・ロック"], who:["The Rock","Roman Reigns","Oba Femi"],
 src:[["Self Made Pro（SEScoopsが紹介）","https://www.sescoops.com/article/wwe-backup-plan-wrestlemania-43-the-rock"]],
 res:"open", rn:""},

{id:"n-wm43-london-raw", d:"2026-06-25", k:"rum", t:"レッスルマニア43直前のRAWはロンドンから？",
 b:"レッスルマニア直前（いわゆるゴーホーム）のRAWを、ロンドンのO2アリーナで開くのではないか、という話がロッカールームで出ているとレスルボーツが伝えた。あくまで選手たちの間の予想という扱い。サウジ開催で本場ロンドンが外れたことへの、ファンの不満を受けた話とも読める。",
 tags:["レッスルマニア43","大会・日程"], who:[],
 src:[["WrestleVotes Radio／Fightful Select（Fightfulが紹介）","https://www.fightful.com/?p=312842"]],
 res:"open", rn:""},

{id:"n-ss2026", d:"2026-07-13", k:"off", t:"サバイバー・シリーズ2026は11月28日、ヒューストンの野球場で",
 b:"WWEが、サバイバー・シリーズ：ウォーゲームズ2026を11月28日（土）に、テキサス州ヒューストンのダイキン・パーク（アストロズの本拠地）で開くと発表した。",
 tags:["大会・日程"], who:[],
 src:[["SEScoops","https://www.sescoops.com/article/wwe-survivor-series-2026-houston-daikin-park"],["WWE公式","https://www.wwe.com/shows/survivor-series-wargames/2026"]], safe:1},

{id:"n-rumble2027", d:"2026-08-04", k:"off", t:"ロイヤルランブル2027はアリゾナのスタジアムで",
 b:"WWEの親会社TKOとアリゾナ州の団体との提携発表の場で、UFCのダナ・ホワイト代表が、2027年2月のロイヤルランブルをアリゾナ州グレンデールのステート・ファーム・スタジアム（NFLカーディナルスの本拠地）で開くと明かした。正確な日付はまだ出ていない。",
 tags:["大会・日程"], who:[],
 src:[["SEScoops","https://www.sescoops.com/article/wwe-royal-rumble-2027-location-venue-revealed"],["Fightful","https://www.fightful.com/wrestling-news/dana-white-confirms-wwe-royal-rumble-2027-will-be-held-in-arizona"]], safe:1},

{id:"n-rock-meltzer", d:"2026-08-25", k:"rep", t:"ザ・ロックの試合は難しい？撮影スケジュールとの兼ね合い",
 b:"デイブ・メルツァーによると、サウジ側はザ・ロックにぜひ試合をしてほしいと考えている。ただ、ザ・ロックは12月から映画「ワイルド・スピード」シリーズ最終作の撮影に入る予定で、メルツァーは練習なしでの試合は考えにくいと見ている。顔を見せるだけなら可能性はある、という見立て。",
 tags:["レッスルマニア43","ザ・ロック"], who:["The Rock"],
 src:[["Wrestling Observer Radio（Wrestling Incが紹介）","https://www.wrestlinginc.com/2243803/wwe-wrestlemania-43-rock-dwayne-johnson-dave-meltzer-saudi-arabia-wants-work/"]]},

{id:"n-cj2026-concern", d:"2026-10-08", k:"rep", t:"クラウン・ジュエル2026のサウジ開催、社内で話し合い",
 b:"11月7日にリヤドで予定されているクラウン・ジュエルについて、WWE社内で予定どおりサウジへ行くかどうかの話し合いが出ていると、フィギュア・フォー・ウィークリーのブライアン・アルバレスが伝えた。リヤドの空港などへの攻撃が報じられ、米国大使館も注意を呼びかけている。大会は予定表に残っていて、会場の準備も始まっているという。",
 tags:["大会・日程"], who:[],
 src:[["Figure Four Weekly（Wrestling Incが紹介）","https://www.wrestlinginc.com/2281871/wwe-crown-jewel-2026-big-topic-conversation-strikes-intensify/"]],
 res:"open", rn:"予定どおりリヤドで開かれるかどうか。"},

{id:"n-wm43-early-card", d:"2026-10-16", k:"rum", t:"レッスルマニア43のメイン候補、早くも名前が挙がる",
 b:"レスルボーツによると、レッスルマニア43の初期案として、世界ヘビー級王者ローマン・レインズ対オバ・フェミが有力になっていて、メインにという声もある。コーディ・ローデスとCMパンクも大きな役割を担う見込みで、サマースラムの再戦の案もあるという。けがで休んでいるリア・リプリーも、回復しだいで女子の大きな試合に関わる見込み。日程の発表は今のところ後回しとのこと。",
 tags:["レッスルマニア43"], who:["Roman Reigns","Oba Femi","Cody Rhodes","CM Punk","Rhea Ripley"],
 src:[["WrestleVotes Radio／Fightful Select（Wrestling Incが紹介）","https://www.wrestlinginc.com/2288510/wwe-wrestlemania-43-early-plans-card-backstage-report/"],["The Takedown on SI（Yahoo Sports）","https://sports.yahoo.com/articles/latest-potential-wrestlemania-43-main-144536807.html"]],
 res:"open", rn:""},

{id:"n-gunther-creative", d:"2026-10-16", k:"rum", t:"SmackDownのある実力者の扱いに、裏方で戸惑いの声",
 b:"WWEの関係者の話として、グンターのSmackDownでの方向性に、制作陣の一部が少し戸惑っているとレスルボーツが伝えた。会社との対立という話ではない、と添えられている。",
 tags:["選手"], who:["Gunther"],
 src:[["WrestleVotes Radio（The Takedown on SI／Yahoo Sportsが紹介）","https://sports.yahoo.com/articles/latest-potential-wrestlemania-43-main-144536807.html"]],
 res:"open", rn:""},

{id:"n-cj2026-backup", d:"2026-10-15", k:"rep", t:"クラウン・ジュエル2026、表に出せない「もしもの備え」",
 b:"10月8日の報道の続報。デイブ・メルツァーによると、リヤドへ行けなくなった場合の備えはあるものの、WWEはそれを表立って認められないという。代わりの案が出るのは、サウジ側のトゥルキ・アルシャイフ氏が安全でないと判断したときだけになりそうだとしている。選手以外のスタッフの一部からサウジ行きに反対の声が出ていて、会社は「足並みをそろえたい」考えだという。",
 tags:["大会・日程"], who:[],
 src:[["Wrestling Observer Radio（Wrestling Incが紹介）","https://www.wrestlinginc.com/2287805/wwe-united-front-amidst-crown-jewel-uncertainty/"]],
 res:"open", rn:"予定どおりリヤドで開かれるかどうか。"},

{id:"n-cj2026-us-venue", d:"2026-10-15", k:"rum", t:"クラウン・ジュエル2026、米国内に「控えの会場」の話",
 b:"10月8日・15日の報道の続報。レスルボーツによると、大会は今のところ予定どおり進んでいるが、必要になったときのために米国内の代わりの会場が用意できているという。リヤドの空港への攻撃が報じられたことを受けて、サウジ行きを不安視する声が出ていた。",
 tags:["大会・日程"], who:[],
 src:[["WrestleVotes／Fightful Select（Fightfulが紹介）","https://www.fightful.com/?p=334147"]],
 res:"hit", rn:"11月7日、リヤドのザ・ヴェニュー（ANBアリーナ）で開かれた（11月8日のThe Nationalの記事で確認）。"},

{id:"n-cj2026-diplomats", d:"2026-10-21", k:"rep", t:"クラウン・ジュエル2026を前に、米政府がサウジからの退避を指示",
 b:"10月8日・15日の報道の続報。ロイター通信によると、米国務省がサウジアラビアにいる緊急でない職員と家族に国外退去を命じた。フーシ派による民間施設への攻撃が続いていることが理由という。デイブ・メルツァーは、WWEがクラウン・ジュエルで受け取る額を約5000万〜5500万ドル、来年のレッスルマニア43を約1億5000万ドルと見ているとWrestling Incが伝えた。",
 tags:["大会・日程","レッスルマニア43"], who:[],
 src:[["Reuters／Wrestling Observer（Wrestling Incが紹介）","https://www.wrestlinginc.com/2293746/us-state-dept-orders-diplomats-out-saudi-arabia-ahead-wwe-crown-jewel/"]],
 res:"open", rn:"予定どおりリヤドで開かれるかどうか。"},

{id:"n-cj2026-travel", d:"2026-10-23", k:"rep", t:"クラウン・ジュエル2026、渡航と収録の段取りが伝わる",
 b:"10月21日の報道の続報。PWInsiderによると、WWEは11月7日のクラウン・ジュエルを予定どおりリヤドで開く方針という。Fightful Selectは、渡航に合わせて11月2日にSmackDownを前もって収録し、大会後は9日のRAWから米国に戻る段取りだと伝えた。メルツァーは、サウジでの大会を手放すと四半期の利益に響くことが判断の背景にあると見ている。",
 tags:["大会・日程"], who:[],
 src:[["PWInsider／Fightful Select（Wrestling Incが紹介）","https://www.wrestlinginc.com/2295017/wwe-crown-jewel-saudi-arabia-riyadh-taping-travel-plans/"]],
 res:"hit", rn:"11月7日、リヤドのザ・ヴェニュー（ANBアリーナ）で開かれた（11月8日のThe Nationalの記事で確認）。"},

{id:"n-cj2026-emanuel", d:"2026-10-22", k:"off", t:"クラウン・ジュエル2026、TKOのトップが現状を語る",
 b:"10月8日以降の報道の続報。WWEの親会社TKOのアリ・エマニュエルCEOがFOXニュースのインタビューで、11月7日のリヤドでのクラウン・ジュエルは予定どおりで、何も中止していないと話したとSEScoopsなどが伝えた。社内のチームが現地の情勢を「毎日見ている」といい、開催するかどうか、移す場合はどこにするかも含めて準備しているという。",
 tags:["大会・日程"], who:[],
 src:[["FOX News（SEScoopsが紹介）","https://www.sescoops.com/article/ari-emanuel-says-wwe-crown-jewel-2026-is-still-set-for-riyadh"],["Yahoo Sports","https://sports.yahoo.com/wrestling/article/tko-ceo-ari-emanuel-gives-update-on-wwe-crown-jewel-amid-deadly-attacks-in-saudi-arabia-181110331.html"]],
 res:"hit", rn:"11月7日、リヤドのザ・ヴェニュー（ANBアリーナ）で開かれた（11月8日のThe Nationalの記事で確認）。"},

{id:"n-cj2026-embassy-airports", d:"2026-10-25", k:"rep", t:"クラウン・ジュエル2026を前に、米大使館がサウジの空港について新たに注意喚起",
 b:"10月21日の報道の続報。POST Wrestlingによると、在サウジアラビア米国大使館が10月25日、国内の空港を使う際は「細心の注意」を払うよう求める警戒情報を出した。空港への攻撃や空域の閉鎖、欠航のおそれがあるためという。リヤドの空港は一部で運航を再開している。WWEは11月7日の大会について、変更を発表していない。",
 tags:["大会・日程"], who:[],
 src:[["POST Wrestling","https://www.postwrestling.com/2026/10/25/u-s-embassy-urges-extreme-caution-at-saudi-airports-in-fresh-alert-ahead-of-wwe-crown-jewel/"]],
 res:"open", rn:"予定どおりリヤドで開かれるかどうか。"},

{id:"n-cj2026-staff-unease", d:"2026-10-26", k:"rep", t:"クラウン・ジュエル2026、主催側との話し合いと社内の空気",
 b:"10月23日の報道の続報。Fightful Selectによると、WWEはリヤド開催の方針を変えておらず、現地の主催側と絶えず連絡を取り合っているという。一方で、スタッフや選手の一部はこの状況に不満を持っていると伝えた。WWEから大会の変更は発表されていない。",
 tags:["大会・日程"], who:[],
 src:[["Fightful Select（Wrestle Zone／Yahoo Sportsが紹介）","https://sports.yahoo.com/articles/details-emerge-wwe-crown-jewel-121440496.html"],["Cultaholic","https://cultaholic.com/posts/latest-on-wwe-crown-jewel-2026-plans-amidst-us-embassy-riyadh-security-alert"]],
 res:"hit", rn:"11月7日、リヤドのザ・ヴェニュー（ANBアリーナ）で開かれた（11月8日のThe Nationalの記事で確認）。"},

{id:"n-cj2026-onsite-crews", d:"2026-10-26", k:"rep", t:"クラウン・ジュエル2026、現地の準備チームから届く声",
 b:"10月26日の報道の続報。Fightful Selectによると、リヤドの現地では関係者が何週間も前から準備を進めていて、大会は予定どおり行われる見込みだという。現地の関係者は情勢を「報道ほど悪くない」と話す一方、話を聞いた選手やスタッフはそれなりに不安を感じているとした。また、アリエル・ヘルワニは自身の番組で、前夜に現地で予定されている別団体の興行のスタッフが、バーレーンに飛んでからバスでリヤドへ入ると伝えたとeWrestlingが紹介している。",
 tags:["大会・日程"], who:[],
 src:[["Fightful Select（Fightful）","https://www.fightful.com/wrestling-news/wwe-crown-jewel-remains-planned-for-saudi-arabia"],["Fightful Select／The Ariel Helwani Show（eWrestlingが紹介）","https://ewrestling.com/article/latest-update-on-wwe-crown-jewel-saudi-arabia-wrestlemania-plans-and-the-sphere-rumors"]],
 res:"hit", rn:"11月7日、リヤドのザ・ヴェニュー（ANBアリーナ）で開かれた（11月8日のThe Nationalの記事で確認）。"},

{id:"n-cj2026-venue-change", d:"2026-10-28", k:"off", t:"クラウン・ジュエル2026、直前に会場の変更が発表される",
 b:"10月26日の報道の続報。リヤド・シーズンの公式Xが、11月7日のクラウン・ジュエルを予定していたリヤド・シーズン・スタジアムから別の会場に移すと発表し、新しい会場は2日以内に知らせるとした。チケットは全額払い戻しで、48時間以内に売り直すという。理由は明かされていない。Fightful Selectは、大会はリヤドで開かれる見込みで、WWE本社のスタッフもこの投稿で移転を知ったと伝えた。",
 tags:["大会・日程"], who:[],
 src:[["Riyadh Season公式X／Fightful Select（POST Wrestlingが紹介）","https://www.postwrestling.com/2026/10/28/wwe-crown-jewel-receives-last-minute-venue-change-reportedly-staying-in-riyadh/"],["Wrestling Inc","https://www.wrestlinginc.com/2300143/wwe-crown-jewel-2026-moving-new-venue-saudi-arabia-riyadh/"]],
 res:"hit", rn:"11月7日、リヤドのザ・ヴェニュー（ANBアリーナ）で開かれた（11月8日のThe Nationalの記事で確認）。", safe:1},

{id:"n-cj2026-kingdom-arena", d:"2026-10-28", k:"rep", t:"クラウン・ジュエル2026、移った先の会場が伝わる",
 b:"10月28日の会場変更の続報。デイブ・メルツァーやフォーブスのアルフレッド・コヌワによると、11月7日のクラウン・ジュエルはリヤド市内のキングダム・アリーナで開かれる見込みという。約3万人が入る会場で、6月のナイト・オブ・チャンピオンズも開かれた場所だとWrestleZoneは伝えた。会場を移した理由は明かされておらず、WWEやリヤド・シーズンからの正式な発表はまだ出ていない。",
 tags:["大会・日程"], who:[],
 src:[["Wrestling Observer（WrestleZoneが紹介）","https://www.wrestlezone.com/news/1668769-wwe-crown-jewel-2026-new-venue-kingdom-arena-riyadh"],["Forbes（Ringside Newsが紹介）","https://www.ringsidenews.com/new-venue-wwe-crown-jewel-2026-revealed-last-minute-change"]],
 res:"miss", rn:"10月30日、リヤド・シーズンの発表で、会場はキングダム・アリーナではなく「ザ・ヴェニュー」と分かった。"},

{id:"n-cj2026-the-venue", d:"2026-10-30", k:"off", t:"クラウン・ジュエル2026、新しい会場が正式に決まる",
 b:"10月28日の会場変更の続報。リヤド・シーズンが発表文で、11月7日のクラウン・ジュエルをリヤド市内の「ザ・ヴェニュー」（ANBアリーナとも呼ばれる屋内会場）で開くと明らかにし、チケットの販売も始まったとPWTorchなどが伝えた。同じ会場では前日の10月31日にボクシングのカネロ・アルバレスの試合が組まれている。先に報じられていたキングダム・アリーナとは別の会場になった。",
 tags:["大会・日程"], who:[],
 src:[["Riyadh Season発表文（PWTorchが紹介）","https://www.pwtorch.com/site/2026/10/30/wwe-announces-new-location-for-crown-jewel-ple/"],["WrestleZone","https://www.wrestlezone.com/news/1669134-wwe-crown-jewel-2026s-new-venue-revealed-after-last-minute-change"]], safe:1},

{id:"n-cj2026-venue-reason", d:"2026-10-30", k:"rep", t:"クラウン・ジュエル2026、会場を移した理由について伝わる話",
 b:"10月30日の会場決定の続報。デイブ・メルツァーによると、会場を移すと決めたのはWWEではなくサウジ側で、屋内の会場のほうが警備をしやすいことが大きな理由だという。メルツァーは、チケットの売れ行きが関係した可能性にも触れたとWrestleZoneが伝えた。新しい会場は、もとの屋外スタジアムよりかなり小さいとAthlon Sportsは伝えている。",
 tags:["大会・日程"], who:[],
 src:[["Wrestling Observer（WrestleZoneが紹介）","https://www.wrestlezone.com/news/1669134-wwe-crown-jewel-2026s-new-venue-revealed-after-last-minute-change"],["Wrestling Observer／Fightful Select（Athlon Sportsが紹介）","https://athlonsports.com/wrestling/wwe-crown-jewel-2026-new-venue-backstage-details"]],
 res:"open", rn:"予定どおりリヤドで開かれるかどうか。"},
{id:"n-wm43-us-backup", d:"2026-10-29", k:"rum", t:"レッスルマニア43、「もしもの備え」の中身が少し見えてくる",
 b:"レスルボーツによると、サウジでの開催が難しくなった場合に備えて、WWEは米国内で開く代わりの計画を練っているという。候補の都市は伏せられている。ラスベガスのスフィアにも社内で関心はあったが、本格的な話し合いはなく、代わりの計画には入っていない見込みとPWManiaが伝えた。レッスルマニア43は今もサウジ開催の予定で、WWEから変更の発表はない。",
 tags:["レッスルマニア43","大会・日程"], who:[],
 src:[["WrestleVotes Radio／Fightful Select（PWManiaが紹介）","https://www.pwmania.com/backstage-update-on-wwe-wrestlemania-43-backup-plans"]],
 res:"open", rn:"レッスルマニア43がサウジで開かれるかどうか。"},

{id:"n-heyman-tv-idea", d:"2026-10-29", k:"rum", t:"ある大物のテレビ復帰について、裏方の案が伝わる",
 b:"レスルボーツによると、ポール・ヘイマンを近いうちにテレビへ戻す案が出ているという。別の話にも関わりつつ、ザ・ヴィジョン、とくにブロン・ブレイカーとのつながりは残す方向だとFightfulが伝えた。まだ案の段階の話。",
 tags:["選手"], who:["Paul Heyman","Bron Breakker"],
 src:[["WrestleVotes Radio／Fightful Select（Fightful）","https://www.fightful.com/wrestling/working-creative-idea-for-paul-heymans-return-to-wwe-tv/"]],
 res:"open", rn:""},

{id:"n-dralistico-interest", d:"2026-10-29", k:"rum", t:"他団体のある選手に、WWEが目を向けるとの話",
 b:"レスルボーツによると、AEWのドラリスティコの今後の身の振り方がはっきりしてきたら、WWEは関心を示す見込みだという。AEWとの契約は2026年12月までと見られているとFightfulが伝えた。兄のドラゴン・リーはWWEに所属している。",
 tags:["選手"], who:["Dragon Lee"],
 src:[["WrestleVotes Radio／Fightful Select（Fightful）","https://www.fightful.com/wrestling/wwe-expected-to-show-interest-in-dralistico-if-when-his-availability-becomes-clearer/"]],
 res:"open", rn:""},

{id:"n-hbk-creative-exec", d:"2026-10-30", k:"rep", t:"WWEの制作陣の人事、レッスルマニア43の後に動きか",
 b:"PWInsiderによると、WWEはショーン・マイケルズを、ブルース・プリチャードに代わる制作・選手担当の幹部に引き上げるつもりだという。移るのはレッスルマニア43の後の予定で、プリチャードは相談役に回る見込み。マイケルズが抜けたあとのNXTでは、AJスタイルズが大きな役割を担うという見方も出ている。会社からの正式な発表はない。",
 tags:["選手"], who:["Shawn Michaels","AJ Styles"],
 src:[["PWInsider（Khel Nowが紹介）","https://khelnow.com/wwe/shawn-michaels-to-replace-bruce-prichard-wwe-202610"]],
 res:"open", rn:"マイケルズが新しい役職に就くかどうか。"},

{id:"n-jan1-sd-dynamite", d:"2026-11-01", k:"rep", t:"2027年元日のSmackDown、他団体との放送の重なりは避けられる見込み",
 b:"デイブ・メルツァーによると、2027年1月1日（金）のAEWダイナマイトはSmackDownの始まる前に終わるため、2つの番組が同じ時間にぶつかることはないという。先に「真っ向勝負になる」と伝えた分を、メルツァー自身が訂正したとCultaholicが伝えた。"
 ,
 tags:["大会・日程"], who:[],
 src:[["Wrestling Observer Radio（Cultaholicが紹介）","https://cultaholic.com/posts/aew-dynamite--wwe-smackdown-not-going-head-to-head-on-january-1"]]},
{"id": "n-cena-classic-disney", "d": "2026-11-02", "k": "off", "t": "12月14日のRAWは2本立てに、片方はフロリダのディズニーで", "b": "WWEは、12月14日（月）にRAWを2本放送すると明らかにした。通常のRAWはオーストラリアのパースで、もう1本の「ジョン・シナ・クラシック」の回はオーランドのディズニー・ワールド内にあるESPNのスポーツ施設で行うという。11月2日のRAWでの発表を、Fightfulなどが伝えた。", "tags": ["大会・日程"], "who": ["John Cena"], "src": [["Fightful", "https://www.fightful.com/wrestling/337121-john-cena-classic-cody-rhodes/"], ["WDWNT（Fightful Selectの報道を紹介）", "https://wdwnt.com/2026/11/john-cena-tournament-reportedly-coming-to-walt-disney-world/"]], "res": "", "rn": ""},
{"id": "n-cena-ss2026", "d": "2026-11-03", "k": "off", "t": "サバイバー・シリーズ2026に、ある大物の登場が決まる", "b": "WWEは公式Xで、ジョン・シナが11月28日ヒューストンのサバイバー・シリーズに登場すると告知した。前日にはFightful Selectが、シナの出演予定が組まれていると伝えていた。", "tags": ["大会・日程", "選手"], "who": ["John Cena"], "src": [["WWE公式X／Fightful Select（Fightfulが紹介）", "https://www.fightful.com/wrestling-news/john-cena-to-appear-at-wwe-survivor-series-wargames-2026"]], "res": "", "rn": ""},
{"id": "n-ajstyles-scouting", "d": "2026-11-03", "k": "rep", "t": "新人発掘の現場で、あるベテランの役割が大きくなる見込み", "b": "Fightful Selectは、AJスタイルズがWWEの人材発掘でより大きな役割を持つ見込みだと伝えた。パフォーマンス・センターを取り仕切っているという噂については、関係者が否定し、授業の代役を務めただけだと話したという。ボビー・ルードを幹部級の役職に就ける案もあるが、決まるにはほど遠いとされる。", "tags": ["選手"], "who": ["AJ Styles", "Bobby Roode"], "src": [["Fightful Select（Fightfulが紹介）", "https://www.fightful.com/wrestling-news/aj-styles-expected-to-gain-more-influence-in-wwe-scouting"]], "res": "open", "rn": ""},
{"id": "n-hbk-prichard-denial", "d": "2026-11-03", "k": "rep", "t": "制作陣の人事の噂、社内からは打ち消す声", "b": "10月30日の噂の続報。ショーン・マイケルズがブルース・プリチャードの役職を引き継ぐという見方について、Fightful SelectはWWEの関係者から「そうではない」との話を得たと伝えた。WWE、NXT、Evolve、IDをめぐる変更の噂も不正確か、決まるにはほど遠いという。", "tags": ["選手"], "who": ["Shawn Michaels"], "src": [["Fightful Select（Fightfulが紹介）", "https://www.fightful.com/wrestling/details-on-speculation-regarding-shawn-michaels-taking-over-bruce-prichards-role/"]], "res": "open", "rn": ""},
{"id": "n-eva-marie-return", "d": "2026-11-03", "k": "self", "t": "元WWEのある女子選手、リング復帰の条件を語る", "b": "2021年にWWEを離れたイーヴァ・マリーが、TMZ Inside The Ringのインタビューで、復帰するなら高額の報酬と、ある程度の創作面での発言権が必要だと話した。「ゼロがたくさん付かないと」と語ったという。", "tags": ["選手"], "who": ["Eva Marie"], "src": [["TMZ Inside The Ring（Fightfulが紹介）", "https://www.fightful.com/wrestling/eva-marie-says-shed-need-a-lot-of-money-and-some-type-of-creative-control-to-wrestle-again/"]], "res": "", "rn": ""},
{"id": "n-jake-roberts-contract", "d": "2026-11-03", "k": "self", "t": "伝説の選手、WWEとの契約について自ら説明", "b": "ジェイク・ロバーツが自身のXに投稿した動画で、WWEとは契約していないと話した。10月下旬には再契約したと話していたが、関わっているのはサイン会やカードのサインだけだという。", "tags": ["選手"], "who": ["Jake Roberts"], "src": [["本人のX（Fightfulが紹介）", "https://www.fightful.com/wrestling/jake-roberts-clarifies-that-he-isnt-under-contract-with-wwe/"]], "res": "", "rn": ""},
{"id": "n-tko-q3-2026", "d": "2026-11-04", "k": "off", "t": "親会社TKOの7〜9月期決算、WWEの興行収入は前年より減る", "b": "TKOが2026年7〜9月期の決算を発表し、グループ全体の売上は前年より21%増えて約13.6億ドル、通期の見通しも引き上げたとPOST Wrestlingが伝えた。一方でWWEの売上は1%減の約3.99億ドルで、興行（ライブイベント）の収入は約3割減った。会社は、主要な大会がこの期に3つ少なかったことと、サマースラムの売れ行きが前年を下回ったことを理由に挙げている。TKOのマーク・シャピロ社長は、チケットの売れ行きが下り坂だという見方を否定したという。", "tags": ["大会・日程"], "who": [], "src": [["TKO決算発表（POST Wrestlingが紹介）", "https://www.postwrestling.com/2026/11/04/tko-upgrades-2026-guidance-after-strong-quarter-from-the-ufc-wwe-experiences-live-event-decline/"]], "res": "", "rn": ""},
{"id": "n-wm43-tko-cfo", "d": "2026-11-04", "k": "off", "t": "レッスルマニア43のサウジとの契約、TKOの財務責任者が中身を語る", "b": "TKOのアンドリュー・シュライマー最高財務責任者が決算説明の電話会見で、レッスルマニア43ではチケットの売上はサウジ側が受け取るが、TKOには開催料が入り、すでに半分を受け取ったと話したとFightfulが伝えた。観客数などの目標は契約に入っていないという。ESPNとの契約では米国のゴールデンタイムに放送する枠として決まっていて、ほかの大会より少し早い時間に始まるかもしれないとも話した。日程はまだ発表されていない。", "tags": ["レッスルマニア43", "大会・日程"], "who": [], "src": [["TKO決算説明会（Fightfulが紹介）", "https://www.fightful.com/wrestling/tko-cfo-gives-more-insight-into-wrestlemania-43-deal-with-saudi-arabia/"]], "res": "", "rn": ""}
];
