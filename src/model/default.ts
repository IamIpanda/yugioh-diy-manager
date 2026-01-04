const strings = `
!setname 0x1 正义盟军	A・O・J
!setname 0x2 次世代	ジェネクス
!setname 0x1002 真次世代	レアル·ジェネクス
#!setname 0x2002 盟军·次世代	A・ジェネクス
!setname 0x3 魅惑的女王	魅惑の女王
!setname 0x4 亚马逊	アマゾネス
!setname 0x5 秘仪之力	アルカナフォース
!setname 0x6 暗黑界	暗黒界
!setname 0x7 古代的机械	アンティーク・ギア
!setname 0x8 英雄	HERO
!setname 0x3008 元素英雄	E・HERO
!setname 0x5008 幻影英雄	V・HERO
!setname 0x6008 邪心英雄	E-HERO
!setname 0xa008 假面英雄	M・HERO
!setname 0xc008 命运英雄	D-HERO
!setname 0x9 新宇	ネオス
!setname 0xa 入魔	ヴェルズ
!setname 0x100a 侵入魔鬼	インヴェルズ
!setname 0xb 永火	インフェルニティ
!setname 0xc 外星	エーリアン
!setname 0xd 剑士	セイバー
!setname 0x100d X-剑士	X－セイバー
#setname 0x300d XX-剑士	XX－セイバー
!setname 0x400d 元素灵剑士	エレメントセイバー
!setname 0xe 电气	エレキ
!setname 0xf 扰乱	おジャマ
!setname 0x10 薰风	ガスタ
!setname 0x11 机巧	カラクリ
!setname 0x12 青蛙	ガエル
!setname 0x13 机皇	機皇
!setname 0x3013 机皇帝	機皇帝
!setname 0x5013 机皇神	機皇神
!setname 0x6013 机皇兵	機皇兵
#setname 0x14 N/A
!setname 0x15 巨大战舰	巨大戦艦
!setname 0x16 机人	ロイド
!setname 0x1016 交通机人	ビークロイド
!setname 0x2016 疾行机人	スピードロイド
!setname 0x17 同调	シンクロ
!setname 0x1017 同调士	シンクロン
!setname 0x2017 同调龙	シンクロ・ドラゴン
!setname 0x18 云魔物	雲魔物
!setname 0x19 剑斗	グラディアル
!setname 0x1019 剑斗兽	剣闘獣
!setname 0x1a 黑蝎	黒蠍
!setname 0x1b 幻兽	幻獣
!setname 0x101b 幻兽机	幻獣機
!setname 0x1c 死之信息	死のメッセージ
!setname 0x1d 核成	コアキメイル
!setname 0x1e 茧状体	C（コクーン）
!setname 0x1f 新空间侠	N（ネオスペーシアン）
!setname 0x20 紫炎	紫炎
!setname 0x21 地缚	地縛
!setname 0x1021 地缚神	地縛神
!setname 0x22 朱罗纪	ジュラック
!setname 0x23 罪	Sin
!setname 0x24 废铁	スクラップ
!setname 0x25 链	C（チェーン）
!setname 0x26 变形斗士	D（ディフォーマー）
!setname 0x27 科技属	TG（テックジーナス）
!setname 0x28 电池人	電池メン
!setname 0x29 龙骑兵团	ドラグニティ
!setname 0x2a 自然	ナチュル
!setname 0x2b 忍者
!setname 0x2c 炎狱	フレムベル
#setname 0x2d N/A
!setname 0x2e 守墓	墓守
!setname 0x2f 冰结界	氷結界
!setname 0x30 大日	ヴァイロン
!setname 0x31 命运女郎	フォーチュンレディ
!setname 0x32 火山	ヴォルカニック
!setname 0x33 黑羽	BF（ブラックフェザー）
!setname 0x1033 强袭黑羽	A BF（アサルト ブラックフェザー）
!setname 0x34 宝玉	宝玉
!setname 0x1034 宝玉兽	宝玉獣
!setname 0x2034 究极宝玉神	究極宝玉神
!setname 0x5034 高等宝玉兽	A宝玉獣
!setname 0x35 魔轰神	魔轟神
!setname 0x36 机甲	マシンナーズ
!setname 0x37 霞之谷	霞の谷
!setname 0x38 光道	ライトロード
!setname 0x39 熔岩	ラヴァル
!setname 0x3a 遗式	リチュア
!setname 0x3b 真红眼	レッドアイズ
!setname 0x3c 爬虫妖	レプティレス
#setname 0x3d 六武
!setname 0x103d 六武众	六武衆
!setname 0x203d 六武式
#setname 0x503d 真六武众	真六武衆
!setname 0x903d 影六武众	影六武衆
!setname 0x3e 异虫	ワーム
!setname 0x3f 救世	セイヴァー
!setname 0x40 被封印	封印されし
!setname 0x41 LV	LV（レベル）
!setname 0x42 极星	極星
!setname 0x3042 极星天	極星天
!setname 0x5042 极星宝	極星宝
!setname 0x6042 极星兽	極星獣
!setname 0xa042 极星灵	極星霊
!setname 0x43 废品	ジャンク
!setname 0x44 代行者
!setname 0x45 恶魔	デーモン
!setname 0x1045 红莲魔|恶魔	レッド・デーモン
!setname 0x46 融合	融合/フュージョン
!setname 0x1046 融合龙	フュージョン・ドラゴン
!setname 0x47 宝石	ジェム
!setname 0x1047 宝石骑士	ジェムナイト
!setname 0x48 No.	No.
!setname 0x1048 混沌No.	CNo.
!setname 0x49 铳士	銃士
!setname 0x4a 时械神	時械神
!setname 0x4b 极神	極神
!setname 0x4c 落穴	落とし穴
#setname 0x4d N/A
#setname 0x4e 进化	エヴォル
!setname 0x304e 进化虫	エヴォルド
!setname 0x504e 进化帝	エヴォルカイザー
!setname 0x604e 进化龙	エヴォルダー
#setname 0x4f 爆裂	バスター
!setname 0x104f /爆裂体	／バスター
!setname 0x50 蛇毒	ヴェノム
!setname 0x1050 凶饿毒|蛇毒	スターヴ・ヴェノム
!setname 0x51 零件	ガジェット
!setname 0x52 守护者	ガーディアン
!setname 0x1052 门之守护神|守护者	ゲート・ガーディアン
!setname 0x2052 法理守护者	ローガーディアン
!setname 0x53 星圣	セイクリッド
!setname 0x54 我我我	ガガガ
!setname 0x55 光子	フォトン
!setname 0x56 甲虫装机	甲虫装機
!setname 0x57 共鸣者	リゾネーター
!setname 0x58 发条	ゼンマイ
!setname 0x59 隆隆隆	ゴゴゴ
!setname 0x5a 企鹅	ペンギン
!setname 0x5b 番茄小子	トマボー
!setname 0x5c 斯芬克斯	スフィンクス
#setname 0x5d N/A
#setname 0x5e N/A
#setname 0x5f N/A
!setname 0x60 竹光
!setname 0x61 忍法
!setname 0x62 卡通	トゥーン
!setname 0x63 反应机	リアクター
!setname 0x64 鹰身	ハーピィ
!setname 0x65 侵略的	侵略の
!setname 0x66 战士	ウォリアー
!setname 0x1066 音响战士	音響戦士
!setname 0x2066 磁石战士	マグネット・ウォリアー
#setname 0x67 钢铁	アイアン
#setname 0x68 铁皮	ブリキ
!setname 0x69 圣刻	聖刻
!setname 0x6a 幻蝶刺客	幻蝶の刺客
!setname 0x6b 保镖	バウンサー
#setname 0x6c 光芒使者	ライトレイ
!setname 0x6d 魔人	魔人（まじん）
!setname 0x6e 魔导	魔導
!setname 0x106e 魔导书	魔導書
!setname 0x6f 英豪	ヒロイック
!setname 0x106f 英豪挑战者	H・C
#setname 0x206f 英豪冠军	H－C
!setname 0x70 先史遗产	先史遺産
!setname 0x71 魔偶甜点	マドルチェ
!setname 0x72 齿轮齿轮	ギアギア
!setname 0x1072 齿轮齿轮人	ギアギアーノ
!setname 0x73 超量	エクシーズ
!setname 0x1073 混沌超量	CX（カオスエクシーズ）
!setname 0x2073 超量龙	エクシーズ・ドラゴン
!setname 0x4073 铠装超量	アーマード・エクシーズ
!setname 0x74 水精鳞	水精鱗
!setname 0x75 深渊	アビス
!setname 0x76 纹章兽	紋章獣
!setname 0x77 海皇
!setname 0x78 迅捷	素早い
!setname 0x79 炎星
#setname 0x7a 圣	聖
!setname 0x107a 圣骑士	聖騎士（せいきし）
!setname 0x207a 圣剑	聖剣（せいけん）
!setname 0x507a 焰圣骑士	焔聖騎士
!setname 0x607a 焰圣剑	焔聖剣
!setname 0x7b 银河	ギャラクシー
!setname 0x107b 银河眼	ギャラクシーアイズ
!setname 0x307b 银河眼时空龙	ギャラクシーアイズ・タキオン・ドラゴン
!setname 0x7c 炎舞
!setname 0x7d 阳炎	ヘイズ
!setname 0x107d 阳炎兽	陽炎獣
!setname 0x7e 异热同心	ゼアル
!setname 0x107e 异热同心武器	ZW（ゼアル・ウェポン）
!setname 0x207e 异热同心从者	ZS（ゼアル・サーバス）
!setname 0x7f 霍普	ホープ
!setname 0x107f 希望皇 霍普	希望皇ホープ
!setname 0x207f 未来皇 霍普	未来皇ホープ
!setname 0x80 尘妖	ダストン
!setname 0x81 炎王
!setname 0x1081 炎王兽	炎王獣
!setname 0x82 怒怒怒	ドドド
!setname 0x83 人偶	パペット
!setname 0x1083 机关傀儡	ギミック・パペット
#setname 0x84 燃烧拳	バーニングナック
!setname 0x1084 燃烧拳击手	BK（バーニングナックラー）
!setname 0x2084 燃烧拳	バーニングナックル
!setname 0x85 超级防卫机器人	SDロボ
!setname 0x86 光天使
!setname 0x87 阴影	アンブラル
!setname 0x88 武神
!setname 0x89 洞	ホール
#setname 0x8a 虫惑	蟲惑
!setname 0x108a 虫惑魔	蟲惑魔
!setname 0x8b 食恶	マリスボラス
#setname 0x8c 德鲁伊	ドルイド
!setname 0x8d 鬼计	ゴーストリック
!setname 0x8e 吸血鬼	ヴァンパイア
!setname 0x8f 刷拉拉	ズババ
!setname 0x90 森罗	森羅
!setname 0x91 王家长眠之谷	ネクロバレー
!setname 0x92 纹章	メダリオン
!setname 0x93 电子	サイバー
!setname 0x1093 电子龙	サイバー・ドラゴン
!setname 0x2093 电子化天使	サイバー・エンジェル
!setname 0x4093 电子暗黑	サイバー・ダーク/サイバーダーク
!setname 0x94 电子科技	サイバネティック
!setname 0x95 升阶魔法	RUM
!setname 0x96 电子鱼人|非「电子」	フィッシュボーグ
!setname 0x97 古遗物	アーティファクト
!setname 0x98 魔术师	魔術師
!setname 0x99 异色眼	オッドアイズ
!setname 0x9a 超重武者
!setname 0x109a 超重武者装留
!setname 0x9b 幻奏
!setname 0x109b 幻奏的音姬	幻奏の音姫
!setname 0x9c 星骑士	テラナイト
!setname 0x109c 星辉士|星骑士	ステラナイト
!setname 0x9d 影依	シャドール
!setname 0x9e 龙星	竜星
!setname 0x9f 娱乐伙伴	EM（エンタメイト）
!setname 0xa0 传说的骑士	伝説の騎士
!setname 0xa1 传说之龙	伝説の竜
#setname 0xa2 魔术	マジシャン
!setname 0x10a2 黑魔术	ブラック・マジシャン
!setname 0x20a2 魔术少女	マジシャン・ガール
!setname 0x30a2 黑魔术少女	ブラック・マジシャン・ガール
!setname 0xa3 星尘	スターダスト
!setname 0xa4 栗子球	クリボー
!setname 0x10a4 羽翼栗子球	ハネクリボー
!setname 0xa5 变化	チェンジ
!setname 0xa6 幼芽	スプラウト
!setname 0xa7 阿托利斯	アルトリウス
!setname 0xa8 兰斯洛特	ランスロット
!setname 0xa9 毛绒动物	ファーニマル
!setname 0xaa 机壳	クリフォート
!setname 0x10aa 隐藏的机壳	アポクリフォート
!setname 0xab 文具电子人|非「电子」	ブンボーグ
!setname 0xac 哥布林	ゴブリン
!setname 0x10ac 哥布林骑手	ゴブリンライダー
!setname 0xad 魔玩具	デストーイ
!setname 0xae 契约书	契約書
!setname 0xaf DD
!setname 0x10af DDD
!setname 0xb0 加特姆士	ガトムズ
!setname 0xb1 彼岸
!setname 0xb2 超级运动员	U.A.
!setname 0xb3 妖仙兽	妖仙獣
!setname 0xb4 影灵衣	影霊衣
!setname 0xb5 灵兽	霊獣
!setname 0x10b5 灵兽使	霊獣使い
!setname 0x20b5 精灵兽	精霊獣
#!setname 0x30b5 精灵兽使	精霊獣使い
!setname 0x40b5 圣灵兽骑	聖霊獣騎
!setname 0xb6 外神
!setname 0xb7 旧神
!setname 0xb8 古神
!setname 0xb9 烈焰加农炮	ブレイズ・キャノン
!setname 0xba 急袭猛禽	RR（レイド・ラプターズ）
!setname 0xbb 狱火机	インフェルノイド
!setname 0xbc 人造人	人造人間
!setname 0xbd 暗黑骑士 盖亚	暗黒騎士ガイア
!setname 0xbe 帝王	帝王
!setname 0xbf 灵使	霊使い
!setname 0xc0 凭依	憑依
!setname 0x10c0 凭依装着	憑依装着
!setname 0xc1 PSY骨架	PSYフレーム
!setname 0x10c1 PSY骨架装备	PSYフレームギア
!setname 0xc2 动力工具	パワー・ツール
!setname 0xc3 锋利小鬼	エッジインプ
!setname 0xc4 神数	セフィラ
!setname 0xc5 炼狱	煉獄
!setname 0xc6 娱乐法师	Em（エンタメイジ）
!setname 0xc7 龙剑士	竜剣士
!setname 0xc8 点火骑士	イグナイト
!setname 0xc9 芳香	アロマ
!setname 0xca 魔装战士	魔装戦士
!setname 0xcb 以太神兵龙	イーサルウェポン
!setname 0xcc 占术姬	占術姫
!setname 0xcd 水伶女	アクアアクトレス
!setname 0xce 水族馆	アクアリウム
!setname 0xcf 混沌	カオス
!setname 0x10cf 混沌战士	カオス・ソルジャー
!setname 0xd0 威风妖怪	マジェスペクター
!setname 0xd1 灰篮	グレイドル
!setname 0xd2 星际仙踪	Kozmo
!setname 0xd3 坏兽	壊獣
!setname 0xd4 伯吉斯异兽	バージェストマ
!setname 0xd5 但丁	ダンテ
!setname 0xd6 破坏剑	破壊剣
!setname 0xd7 破坏之剑士	バスター・ブレイダー
!setname 0xd8 雾动机龙	ダイナミスト
!setname 0xd9 不知火
!setname 0x10d9 妖刀-不知火	妖刀－不知火
!setname 0xda 龙魔王	竜魔王
!setname 0xdb 幻影	ファントム
!setname 0x10db 幻影骑士团	幻影騎士団
!setname 0xdc 超级量子	超量
!setname 0x10dc 超级量子战士	超量士
!setname 0x20dc 超级量子机兽	超量機獣
!setname 0xdd 青眼	ブルーアイズ
!setname 0xde 艾克佐迪亚	エクゾディア
!setname 0xdf 月光	ムーンライト
!setname 0xe0 无形噬体	アモルファージ
!setname 0xe1 炼装	メタルフォーゼ
!setname 0xe2 三形金字塔	トラミッド
!setname 0xe3 方界
!setname 0xe4 精灵剑士	エルフの剣士
!setname 0xe5 光波	サイファー
!setname 0x10e5 光波龙	サイファー・ドラゴン
!setname 0xe6 花札卫	花札衛
!setname 0xe7 沉默剑士	サイレント・ソードマン
!setname 0xe8 沉默魔术师	サイレント・マジシャン
!setname 0xe9 磁石战士	磁石の戦士(じしゃくのせんし)
!setname 0xea 水晶机巧|非「机巧」	クリストロン
!setname 0xeb 化合兽	化合獣
#!setname 0xec	魔界	魔界
!setname 0x10ec 魔界剧团	魔界劇団
!setname 0x20ec 魔界台本	魔界台本
!setname 0xed 地中族	サブテラー
!setname 0x10ed 地中族邪界	サブテラーマリス
!setname 0xee 秘旋谍	SPYRAL
!setname 0x10ee 秘旋谍装备	SPYRAL GEAR
!setname 0x20ee 秘旋谍任务	SPYRAL MISSION
!setname 0xef 堕天使
!setname 0xf0 风魔女	WW（ウィンド・ウィッチ）
!setname 0xf1 十二兽	十二獣
!setname 0xf2 灵摆	ペンデュラム
!setname 0x10f2 灵摆龙	ペンデュラム・ドラゴン
!setname 0x20f2 灵摆读阵	ペンデュラムグラフ
!setname 0xf3 捕食	プレデター
!setname 0x10f3 捕食植物
!setname 0xf4 召唤兽	召喚獣
!setname 0xf5 甘多拉	ガンドラ
!setname 0xf6 摩天楼
!setname 0xf7 抒情歌鸲	LL（リリカル・ルスキニア）
#!setname 0xf8 霸王	覇王
!setname 0x10f8 霸王门	覇王門
!setname 0x20f8 霸王眷龙	覇王眷竜
!setname 0xf9 真龙	真竜
!setname 0xfa 幻煌龙	幻煌龍
!setname 0xfb 淘气仙星	トリックスター
!setname 0xfc 刚鬼	剛鬼
!setname 0xfd 星杯
!setname 0xfe 星遗物	星遺物
!setname 0xff 幻透翼	クリアウィング
!setname 0x100 化学结合	ボンディング
!setname 0x101 码语者	コード・トーカー
!setname 0x102 弹丸	ヴァレット
!setname 0x103 幻变骚灵	オルターガイスト
!setname 0x104 机怪虫	クローラー
!setname 0x105 玄化	メタファイズ
!setname 0x106 复仇死者	ヴェンデット
!setname 0x107 方程式运动员	F.A.
!setname 0x108 魔弹	魔弾
!setname 0x109 天气	天気
!setname 0x10a 珀耳修斯	パーシアス
!setname 0x10b 廷达魔三角	ティンダングル
!setname 0x10c 机界骑士	ジャックナイツ
!setname 0x10d 魔导兽|非「魔导」	魔導獣
!setname 0x10e 进化药	進化薬
!setname 0x10f 枪管	ヴァレル
!setname 0x110 纳祭	サクリファイス
!setname 0x1110 眼纳祭神	アイズ・サクリファイス
!setname 0x111 武装龙	アームド・ドラゴン
!setname 0x112 幻崩	トロイメア
!setname 0x113 灵神	霊神
!setname 0x114 空牙团	空牙団
!setname 0x115 闪刀	閃刀
!setname 0x1115 闪刀姬	閃刀姫
!setname 0x116 圣像骑士	パラディオン
!setname 0x117 魔神仪	魔神儀
!setname 0x118 电脑网	サイバネット
!setname 0x119 转生炎兽	サラマングレイト
!setname 0x11a 恐龙摔跤手	ダイナレスラー
!setname 0x11b 自奏圣乐	オルフェゴール
!setname 0x11c 雷龙	サンダー·ドラゴン
!setname 0x11d 禁忌的	禁じられた
!setname 0x11e 未界域
!setname 0x11f 奈芙提斯	ネフティス
!setname 0x120 调皮宝贝	プランキッズ
!setname 0x121 魔妖
!setname 0x122 女武神|非「武神」	ワルキューレ
!setname 0x123 蔷薇	ローズ
!setname 0x1123 蔷薇龙	ローズ・ドラゴン
!setname 0x124 机械天使	機械天使
!setname 0x125 笑容	スマイル
!setname 0x126 时间潜行者	クロノダイバー
!setname 0x127 无限起动	無限起動
!setname 0x128 魔女术	ウィッチクラフト
!setname 0x129 咒眼	呪眼
!setname 0x12a 恩底弥翁	エンディミオン
!setname 0x12b 海晶少女	マリンセス
!setname 0x12c 天威
!setname 0x12d 斯摩夫	シムルグ
!setname 0x12e 占卜魔女	占い魔女
!setname 0x12f 蜂军	B・F（ビー・フォース）
!setname 0x130 破械
!setname 0x1130 破械神
!setname 0x131 梦魔镜	夢魔鏡
!setname 0x132 斩机	斬機
!setname 0x133 半龙女仆	ドラゴンメイド
!setname 0x134 王战	ジェネレイド
!setname 0x135 @火灵天星	@イグニスター
!setname 0x136 “艾”	Ai（アイ）
!setname 0x137 战华	戦華
!setname 0x138 巨石遗物	メガリス
!setname 0x139 守护神官	守護神官
!setname 0x13a 拟声	オノマト
!setname 0x13b 叛逆	リベリオン
!setname 0x13c 代码破坏者	コードブレイカー
!setname 0x13d 星义	ネメシス
!setname 0x13e 巴巴罗斯	バルバロス
!setname 0x13f 海造贼	海造賊
!setname 0x140 魔救	アダマシア
!setname 0x141 六花
#setname 0x142 黄金国	エルド
!setname 0x1142 黄金国巫妖	エルドリッチ
!setname 0x2142 黄金国永生药	エルドリクシル
!setname 0x143 黄金乡	黄金郷
!setname 0x144 幻魔
!setname 0x145 教导	ドラグマ
!setname 0x146 童话动物	メルフィー
!setname 0x147 波波	ポータン
!setname 0x148 罗兰	ローラン
!setname 0x149 化石
!setname 0x14a 源数	ヌメロン
!setname 0x114a 源数之门	ゲート・オブ・ヌメロン
!setname 0x14b 机块	機塊
#setname 0x14c 灵术	霊術
!setname 0x314c 地灵术	地霊術
!setname 0x514c 水灵术	水霊術
!setname 0x614c 火灵术	火霊術
!setname 0x914c 风灵术	風霊術
#setname 0xa14c 光灵术	光霊術
#setname 0xc14c 暗灵术	闇霊術
!setname 0x14d 铁兽	トライブリゲード
!setname 0x14e 电脑堺	電脳堺
!setname 0x114e 电脑堺门	電脳堺門
!setname 0x14f 双天
!setname 0x150 大贤者	マギストス
#setname 0x151 双子	Twin
!setname 0x1151 直播☆双子	Live☆Twin
!setname 0x2151 邪恶★双子	Evil★Twin
!setname 0x152 姬丝基勒	キスキル
!setname 0x153 璃拉	リィラ
!setname 0x154 龙辉巧	ドライトロン
!setname 0x155 护宝炮妖	スプリガンズ
!setname 0x156 治安战警队	S－Force
!setname 0x157 秘异三变	ミュートリア
#setname 0x158 圣	サン
!setname 0x1158 圣蔓	サンヴァイン
!setname 0x2158 圣天树	サンアバロン
!setname 0x4158 圣种	サンシード
!setname 0x159 圣夜骑士	ホーリーナイツ
!setname 0x15a 人偶怪兽	ドール・モンスター
!setname 0x15b 惊乐	アメイズメント
!setname 0x15c 游乐设施	アトラクション
!setname 0x15d 烙印
!setname 0x15e 降阶魔法	RDM
!setname 0x15f 战吼	ウォークライ
!setname 0x160 原质炉	マテリアクトル
!setname 0x161 溟界
!setname 0x162 七音服	ドレミコード
!setname 0x1162 大钢琴之七音服	グランドレミコード
!setname 0x163 北极天熊	ベアルクティ
!setname 0x164 死狱乡	デスピア
!setname 0x165 魔键	魔鍵
!setname 0x166 军贯	軍貫
!setname 0x1167 森之圣兽	森の聖獣
!setname 0x2167 森之圣灵	森の聖霊
!setname 0x168 隐形水母怪	ステルス・クラーゲン
!setname 0x169 原数天灵	ヌメロニアス
!setname 0x16a 编号系	ナンバーズ
!setname 0x16b 相剑	相剣
!setname 0x16c 冰水	氷水
!setname 0x16d 随风旅鸟	ふわんだりぃず
!setname 0x16e 拓扑	トポロジック
!setname 0x16f 许珀里翁	ヒュペリオン
!setname 0x170 骑甲虫	ビートルーパー
!setname 0x171 朋克	P.U.N.K.
!setname 0x172 救祓少女	エクソシスター
!setname 0x173 恐啡肽狂龙	ダイノルフィア
!setname 0x174 恶魔娘	悪魔嬢
!setname 0x175 七皇	セブンス
!setname 0x176 异晶人的	バリアンズ
!setname 0x177 海龙神	リバイアサン
!setname 0x178 潜海	シー・ステルス
!setname 0x179 兽带斗神	セリオンズ
!setname 0x17a 恐吓爪牙族	スケアクロー
!setname 0x17b 野蛮人	バーバリアン
!setname 0x17c 书灵师	リブロマンサー
!setname 0x17d 群豪	ヴァリアンツ
!setname 0x17e 拉比林斯迷宫	ラビュリンス
!setname 0x117e 拉比林斯迷宫欢迎	ウェルカム・ラビュリンス
!setname 0x17f 神碑
!setname 0x180 卫星闪灵	スプライト
!setname 0x181 珠泪哀歌族	ティアラメンツ
!setname 0x182 春化精
!setname 0x183 悠悠	もけもけ
!setname 0x184 翼侠	ウィングマン
#setname 0x185 涂鸦	らくがき
!setname 0x1185 涂鸦兽	らくがきじゅう
!setname 0x2185 涂鸦本	らくがきちょう
!setname 0x186 G石人	Gゴーレム
!setname 0x187 桥梁	架け橋
!setname 0x188 深渊之兽	ビーステッド
!setname 0x189 俱舍怒威族	クシャトリラ
!setname 0x18a 魊影	ゴーティス
!setname 0x18b 救援ACE队	R－ACE
!setname 0x18c 纯爱妖精	ピュアリィ
!setname 0x18d 御巫
!setname 0x18e 仪水镜	儀水鏡
!setname 0x18f 防火	ファイアウォール
!setname 0x190 末那愚子族	マナドゥム
!setname 0x191 妮穆蕾莉娅	ネムレリア
!setname 0x192 黄金荣耀	GP（ゴールド・プライド）
!setname 0x193 迷宫壁	ラビリンス・ウォール
!setname 0x194 至爱	フェイバリット
!setname 0x195 征服斗魂	VS（ヴァンキッシュ・ソウル）
!setname 0x196 新式魔厨	ヌーベルズ
!setname 0x197 食谱	レシピ
!setname 0x198 维萨斯	ヴィサス
!setname 0x199 反击	カウンター
!setname 0x19a 吠陀	ヴェーダ
!setname 0x19b 迪亚贝尔	ディアベル
!setname 0x119b 迪亚贝尔斯塔尔	ディアベルスター
!setname 0x19c 蛇眼	スネークアイ
!setname 0x19d 荷鲁斯	ホルス
!setname 0x119d 荷鲁斯之黑炎龙	ホルスの黒炎竜
!setname 0x19e 罪宝
!setname 0x19f 圣菓使	聖菓使
!setname 0x1a0 哈特	ハート
!setname 0x1a1 莫忘	メメント
!setname 0x1a2 百夫长骑士	センチュリオン
!setname 0x1a3 异响鸣	ヴァルモニカ
!setname 0x1a4 提斯蒂娜	ティスティナ
!setname 0x1a5 于贝尔	ユベル
!setname 0x1a6 肃声	粛声
!setname 0x1a7 白斗气	ホワイト・オーラ
!setname 0x1a8 玩具	トイ
!setname 0x1a9 灿幻	燦幻
!setname 0x1aa 天杯龙	天盃龍
!setname 0x1ab 蕾祸	蕾禍
!setname 0x1ac 飞龙炎	サラマンドラ
!setname 0x1ad 灰灭	灰滅
!setname 0x1ae 千年	千年/ミレニアム
!setname 0x1af 艾格佐德	エグゾード
!setname 0x1b0 刻魔	デモンスミス
!setname 0x1b1 白森林	白き森
!setname 0x1b2 欢聚友伴	マルチャミー
!setname 0x1b3 徽记	エンブレーマ
!setname 0x1b4 时空	タキオン
!setname 0x1b5 蓝泪	青い涙
!setname 0x1b6 石版
!setname 0x1b7 拟箱掳尸	Mimighoul
!setname 0x1b8 鲨	シャーク
!setname 0x11b8 鲨龙兽	シャーク・ドレイク
!setname 0x1b9 原石
!setname 0x1ba 金属化	メタル化
!setname 0x1bb 魔瞳	モルガナイト
!setname 0x1bc 蓟花	アザミナ
!setname 0x1bd 祝台
!setname 0x1be 雷火沸动	ライゼオル
!setname 0x1bf 码丽丝	M∀LICE
!setname 0x1c0 龙华	竜華
!setname 0x1c1 阿尔戈☆群星	ARG☆S
!setname 0x1c2 喷水引擎	アクア・ジェット
!setname 0x1c3 御剑	Mitsurugi
!setname 0x1c4 征龙	征竜
!setname 0x1c5 再世	再世
!setname 0x1c6 统王	ドミナス
`.trim()

const ofurus = `
&: [&(アンド)]
@: [@(アット)]
A: [A(アサルト)]
Ai: [Ai(アイ)]
A宝玉獣: [A(アドバンスド)][宝(ほう)][玉(ぎょく)][獣(じゅう)]
BF: [BF(ブラックフェザー)]
C: [C(チャンピオン)]
CNo.: [CNo.(カオスナンバーズ)]
CiNo.: [CiNo.(カオスイマジナリーナンバーズ)]
C・HERO: [C・HERO(コントラストヒーロー)]
D: [D(ディー)]
D-HERO: [D-HERO(デステニーヒーロー)]
DD: [DD(ディーディー)]
DMZ: [DMZ(ディーエムゼット)]
E-HERO: [E-HERO(イービルヒーロー)]
E.M.R.: [E.M.R.(エレクトロ・マグネティック・レールガン)]
EM: [EM(エンタメイト)]
EN: [EN(イーエヌ)]
EX: [EX(エクストラ)]
EXP: [EXP(エクストラ・ペンデュラム)]
Em: [Em(エンタメイジ)]
Evil★Twin: [Evil★Twin(イビルツイン)]
E・HERO: [E・HERO(エレメンタルヒーロー)]
FNo.: [FNo.(フューチャーナンバーズ)]
G: [G(ジー)]
GC: [GC(ガガガコート)]
GEAR: [GEAR(ギア)]
GG: [GG(ゴゴゴグローブ)]
H: [H(ヒロイック)]
HANZO: [HANZO(ハンゾー)]
HERO: [HERO(ヒーロー)]
HRUM: [HRUM(ハイパーランクアップマジック)]
KAI－DEN: [KAI－DEN(カイデン)]
Kozmo: [Kozmo(コズモ)]
LL: [LL(リリカル・ルスキニア)]
LP: [LP(ライフポイント)]
LV: [LV(レベル)]
Live☆Twin: [Live☆Twin(ライブツイン)]
MAX: [MAX(マックス)]
MISSION: [MISSION(ミッション)]
M・HERO: [M・HERO(マスクドヒーロー)]
N: [N(ネオスペーシアン)]
NEX: [NEX(ネオスペーシアンエクステント)]
No: [No(ノウ)]
No.: [No.(ナンバーズ)]
OKa: [OKa(オカ)]
P: [P(ペンデュラム)]
P.U.N.K: [P.U.N.K(パンク)]
PSY: [PSY(サイ)]
RR: [RR(レイド・ラプターズ)]
RUM: [RUM(ランクアップマジック)]
S: [S(シンクロ)]
SB: [SB(サイバー・ボンテージ)]
SNo.: [SNo.(シャイニングナンバーズ)]
SPYRAL: [SPYRAL(スパイラル)]
SR: [SR(スピードロイド)]
Sin: [Sin(シン)]
S－Force: [S－Force(セキュリティ・フォース)]
TG: [TG(テックジーナス)]
U: [U(ウルトラ)]
U.A.: [U.A.(ウルトラアスリート)]
VW: [VW(ヴィダブル)]
VWXYZ: [VWXYZ(ヴィトゥズィ)]
V・HERO: [V・HERO(ヴィジョンヒーロー)]
WW: [WW(ウィンド・ウィッチ)]
X: [X(エクシーズ)]
XYZ: [XYZ(エックスワイゼット)]
X・E・N・O: [X・E・N・O(ゼノ)]
X・HERO: [X・HERO(エクストラヒーロー)]
Z: [Z(ゼータ)]
ZS: [ZS(ゼアル・サーバス)]
a－vida: [a－vida(アヴィダ)]
Λ: [Λ(ラムダ)]
Ω: [Ω(オメガ)]
α: [α(アルファ)]
β: [β(ベータ)]
γ: [γ(ガンマ)]
δ: [δ(デルタ)]
ζ: [ζ(ゼータ)]
ＥＸ: [ＥＸ(エクストラ)]
Ｓ: [Ｓ(シンクロ)]
Ｘ: [Ｘ(エクシーズ)]
Ｌ: [Ｌ(リンク)]
一族: [一(いち)][族(ぞく)]
一滴: [一(ひと)][滴(しずく)]
一番: [一(いち)][番(ばん)]
一組: [一(ひと)][組(くみ)]
七: [七(ナ)]
万: [万(ばん)]
万物創世龍: [万物創世龍(テンサウザンド・ドラゴン)]
万華鏡: [万(まん)][華(げ)][鏡(きょう)]
三: [三(さん)]
三戦: [三(さん)][戦(せん)]
上: [上(うえ)]
上げ: [上(あ)]げ
上記: [上(じょう)][記(き)]
下: [下(した)]
不: [不(ふ)]
不知火: [不知火(しらぬい)]
与え: [与(あた)]え
中: [中(なか)]
乗: [乗(の)]
乱: [乱(らん)]
事: [事(こと)]
互い: [互(たが)]い
五: [五(ご)]
五月雨: [五月雨(さみだれ)]
亡: [亡(ぼう)]
交血鬼: [交血鬼(アルダンピール)]
人々: [人(ひと)][々(びと)]
他: [他(ほか)]
仙: [仙(シェン)]
仙獣: [仙(せん)][獣(じゅう)]
代わり: [代(か)]わり
以上: [以(い)][上(じょう)]
以下: [以(い)][下(か)]
以外: [以(い)][外(がい)]
任意: [任(にん)][意(い)]
伝: [伝(つた)]
伝説: [伝(でん)][説(せつ)]
位置: [位(い)][置(ち)]
低: [低(ひく)]
体: [体(たい)]
何: [何(なん)]
使い: [使(つか)]い
使徒: [使(し)][徒(と)]
使用: [使(し)][用(よう)]
俥夫: [俥(しゃ)][夫(ふ)]
個: [個(こ)]
倍: [倍(ばい)]
像: [像(ぞう)]
僧: [僧(そう)]
儀式: [儀(ぎ)][式(しき)]
元々: [元(もと)][々(もと)]
先: [先(さき)]
先史遺産: [先史遺産(オーパーツ)]
光: [光(ひかり)]
光輪: [光(こう)][輪(りん)]
全て: [全(すべ)]て
公開: [公(こう)][開(かい)]
六武: [六(ろく)][武(ぶ)]
六武衆: [六(ろく)][武(ぶ)][衆(しゅう)]
六花: [六(りっ)][花(か)]
兵: [兵(へい)]
内: [内(うち)]
円融魔術: [円融魔術(マジカライズ・フュージョン)]
再: [再(さい)]
冥: [冥(めい)]
冥界: [冥(めい)][界(かい)]
冷薔薇の抱香: [冷薔薇の抱香(フローズン・ロアーズ)]
処分: [処(しょ)][分(ぶん)]
処理: [処(しょ)][理(り)]
出: [出(で)]
分: [分(ふん)]
列車: [列(れっ)][車(しゃ)]
別: [別(べつ)]
前: [前(まえ)]
前世: [前(ぜん)][世(せ)]
剛鬼: [剛(ごう)][鬼(き)]
剣: [剣(けん)]
剣士: [剣(けん)][士(し)]
剣闘獣: [剣闘獣(グラディアルビースト)]
創世: [創(そう)][世(せい)]
創造神: [創(そう)][造(ぞう)][神(しん)]
劇団: [劇(げき)][団(だん)]
力: [力(ちから)]
加: [加(くわ)]
効果: [効(こう)][果(か)]
勅命: [勅(ちょく)][命(めい)]
勝利: [勝(しょう)][利(り)]
勝負: [勝(しょう)][負(ぶ)]
化: [化(か)]
化合獣: [化(か)][合(ごう)][獣(じゅう)]
化身: [化(け)][身(しん)]
十二獣: [十(じゅう)][二(に)][獣(しし)]
千: [千(ち)]
千年: [千(せん)][年(ねん)]
半分: [半(はん)][分(ぶん)]
卿: [卿(きょう)]
原始: [原(げん)][始(し)]
及: [及(およ)]
友情: [友(ゆう)][情(じょう)]
双: [双(そう)]
双天: [双(そう)][天(てん)]
双天将: [双(そう)][天(てん)][将(しょう)]
双穹の騎士: [双穹の騎士(ジャックナイツ・パラディオン)]
反転: [反(はん)][転(てん)]
収納: [収(しゅう)][納(のう)]
取: [取(と)]
受け: [受(う)]け
古: [古(ふる)]
古代: [古(こ)][代(だい)]
召喚: [召(しょう)][喚(かん)]
召喚時: [召(しょう)][喚(かん)][時(じ)]
召喚獣: [召(しょう)][喚(かん)][獣(じゅう)]
可: [可(か)]
台本: [台(だい)][本(ほん)]
史略: [史(し)][略(りゃく)]
右: [右(みぎ)]
合: [合(ごう)]
合わ: [合(あ)]わ
合わせ鏡: [合わせ鏡(スプリット・ミラー)]
合成獣: [合(ごう)][成(せい)][獣(じゅう)]
合計: [合(ごう)][計(けい)]
同じ: [同(おな)]じ
同名: [同(どう)][名(めい)]
同士: [同(どう)][士(し)]
名: [名(めい)]
含: [含(ふく)]
呪: [呪(じゅ)]
呪われ: [呪(のろ)]われ
呪眼: [呪(じゅ)][眼(がん)]
呪術: [呪(じゅ)][術(じゅつ)]
呼: [呼(よ)]
呼吸: [呼(こ)][吸(きゅう)]
咆: [咆(ほう)]
商人: [商(しょう)][人(にん)]
回: [回(かい)]
回復: [回(かい)][復(ふく)]
団: [団(だん)]
土: [土(つち)]
地: [地(ち)]
地獄: [地(じ)][獄(ごく)]
地縛神: [地(じ)][縛(ばく)][神(しん)]
埋葬: [埋(まい)][葬(そう)]
域: [域(いき)]
堕: [堕(だ)]
場合: [場(ば)][合(あい)]
堺: [堺(かい)]
塞: [塞(さい)]
塵: [塵(じん)]
墓: [墓(はか)]
墓地: [墓(ぼ)][地(ち)]
増援: [増(ぞう)][援(えん)]
増殖: [増(ぞう)][殖(しょく)]
壊: [壊(かい)]
壊劫: [壊(かい)][劫(ごう)]
壊星: [壊(かい)][星(せい)]
壊獣: [壊(かい)][獣(じゅう)]
士: [士(し)]
壱: [壱(イ)]
壺: [壺(つぼ)]
変更: [変(へん)][更(こう)]
変生: [変(へん)][生(じょう)]
夢魔鏡: [夢(ゆめ)][魔(ま)][鏡(きょう)]
大: [大(だい)]
大嵐: [大(おお)][嵐(あらし)]
大暴走: [大(だい)][暴(ぼう)][走(そう)]
大欲: [大(たい)][欲(よく)]
天: [天(てん)]
天使: [天(てん)][使(し)]
天威: [天(てん)][威(い)]
天気: [天(てん)][気(き)]
天狗: [天(てん)][狗(ぐ)]
天球: [天(てん)][球(きゅう)]
天界: [天(てん)][界(かい)]
天空: [天(てん)][空(くう)]
天霆號: [天霆號(ネガロギア)]
天龍: [天(てん)][龍(ろう)]
太: [太(だ)]
太古: [太(たい)][古(こ)]
夫: [夫(ゆう)]
失: [失(うしな)]
奇跡: [奇(き)][跡(せき)]
奏: [奏(そう)]
契珖: [契(けい)][珖(こう)]
契約: [契(けい)][約(やく)]
女: [女(じょ)]
好き: [好(す)]き
妖: [妖(よう)]
妖仙獣: [妖(よう)][仙(せん)][獣(じゅう)]
妖刀: [妖(よう)][刀(とう)]
妖精: [妖(よう)][精(せい)]
妖精伝姫: [妖精伝姫(フェアリーテイル)]
妖魔: [妖(よう)][魔(ま)]
妲姫: [妲(だっ)][姫(き)]
姫: [姫(き)]
娘: [娘(むすめ)]
媒: [媒(ばい)]
存在: [存(そん)][在(ざい)]
学園: [学(がく)][園(えん)]
守: [守(しゅ)]
守備: [守(しゅ)][備(び)]
守備力: [守(しゅ)][備(び)][力(りょく)]
守護神: [守(しゅ)][護(ご)][神(しん)]
宝玉: [宝(ほう)][玉(ぎょく)]
宝玉獣: [宝(ほう)][玉(ぎょく)][獣(じゅう)]
宝玉神: [宝(ほう)][玉(ぎょく)][神(しん)]
宝玉陣: [宝(ほう)][玉(ぎょく)][陣(じん)]
宣告: [宣(せん)][告(こく)]
宣告者の神巫: [宣告者の神巫(デクレアラー・ディヴァイナー)]
宣言: [宣(せん)][言(げん)]
宣言時: [宣(せん)][言(げん)][時(じ)]
宮: [宮(きゅう)]
宵星の機神: [宵星の機神(シーオルフェゴール)]
審判: [審(しん)][判(ぱん)]
対: [対(たい)]
対象: [対(たい)][象(しょう)]
封印: [封(ふう)][印(いん)]
将軍: [将(しょう)][軍(ぐん)]
導: [導(みちび)]
少: [少(しょう)]
居合: [居(い)][合(あ)]
屋敷: [屋(や)][敷(しき)]
属性: [属(ぞく)][性(せい)]
層: [層(そう)]
岩: [岩(がん)]
岩石: [岩(がん)][石(せき)]
崔: [崔(さい)]
嵐征竜: [嵐(らん)][征(せい)][竜(りゅう)]
嵬: [嵬(かい)]
巡: [巡(めぐ)]
左: [左(ひだり)]
巨: [巨(きょ)]
巨大: [巨(きょ)][大(だい)]
巨神兵: [巨(きょ)][神(しん)][兵(へい)]
希望: [希(き)][望(ぼう)]
希望皇: [希(き)][望(ぼう)][皇(おう)]
帚: [帚(ぼうき)]
師: [師(し)]
幻: [幻(げん)]
幻奏: [幻(げん)][奏(そう)]
幻影: [幻(げん)][影(えい)]
幻影騎士団: [幻影騎士団(ファントム・ナイツ)]
幻想: [幻(げん)][想(そう)]
幻泉: [幻(げん)][泉(せん)]
幻獣機: [幻(げん)][獣(じゅう)][機(き)]
幻獣王: [幻(げん)][獣(じゅう)][王(おう)]
幻神獣: [幻(げん)][神(しん)][獣(じゅう)]
幻竜: [幻(げん)][竜(りゅう)]
幽鬼: [幽(ゆ)][鬼(き)]
底: [底(てい)]
底なし: [底(そこ)]なし
度: [度(ど)]
度に: [度(たび)]に
廻: [廻(かい)]
式: [式(しき)]
強: [強(つよ)]
強力: [強(きょう)][力(りょく)]
強欲: [強(ごう)][欲(よく)]
形式: [形(けい)][式(しき)]
影: [影(かげ)]
影六武衆: [影(かげ)][六(ろく)][武(ぶ)][衆(しゅう)]
影霊衣: [影霊衣(ネクロス)]
彼岸: [彼(ひ)][岸(がん)]
征竜: [征(せい)][竜(りゅう)]
後: [後(ご)]
得: [得(え)]
御影志士: [御(ミ)][影(カゲ)][志(シ)][士(シ)]
復活: [復(ふっ)][活(かつ)]
必殺: [必(ひっ)][殺(さつ)]
必要: [必(ひつ)][要(よう)]
忍法: [忍(にん)][法(ぽう)]
忍者: [忍(にん)][者(じゃ)]
応: [応(おう)]
恐竜: [恐(きょう)][竜(りゅう)]
悪魔: [悪(あく)][魔(ま)]
惑: [惑(わく)]
意外: [意(い)][外(がい)]
感情: [感(かん)][情(じょう)]
慄: [慄(りつ)]
態: [態(たい)]
憑依: [憑(ひょう)][依(い)]
成功: [成(せい)][功(こう)]
成功時: [成(せい)][功(こう)][時(じ)]
成金: [成(なり)][金(きん)]
戦士: [戦(せん)][士(し)]
戦艦: [戦(せん)][艦(かん)]
戦華: [戦(せん)][華(か)]
戦闘: [戦(せん)][闘(とう)]
戻: [戻(もど)]
所: [所(しょ)]
扉: [扉(とびら)]
手: [手(て)]
手札: [手(て)][札(ふだ)]
才: [才(さい)]
払: [払(はら)]
扱: [扱(あつか)]
抹殺: [抹(まっ)][殺(さつ)]
拮抗: [拮(きっ)][抗(こう)]
持: [持(も)]
持ち主: [持(も)]ち[主(ぬし)]
指令: [指(し)][令(れい)]
指名者: [指(し)][名(めい)][者(しゃ)]
指定: [指(し)][定(てい)]
振: [振(ふ)]
捕食植物: [捕食植物(プレデター・プランツ)]
捧げ: [捧(ささ)]げ
捨て: [捨(す)]て
掌: [掌(しょう)]
推理: [推(すい)][理(り)]
揃: [揃(そろ)]
握手: [握(あく)][手(しゅ)]
援: [援(えん)]
撃: [撃(げき)]
撃滅: [撃(げき)][滅(めつ)]
操作: [操(そう)][作(さ)]
攻: [攻(こう)]
攻撃: [攻(こう)][撃(げき)]
攻撃力: [攻(こう)][撃(げき)][力(りょく)]
放: [放(はな)]
教導: [教導(ドラグマ)]
数: [数(かず)]
数値: [数(すう)][値(ち)]
数字: [数(すう)][字(じ)]
文: [文(もん)]
斬機: [斬(ザン)][機(キ)]
方法: [方(ほう)][法(ほう)]
方界: [方(ほう)][界(かい)]
方界獣: [方(ほう)][界(かい)][獣(じゅう)]
方舟: [方(はこ)][舟(ぶね)]
族: [族(ぞく)]
既: [既(すで)]
旧神: [旧(キュウ)][神(シン)]
昆虫: [昆(こん)][虫(ちゅう)]
星: [星(レベル)]
星杯: [星(せい)][杯(はい)]
星遺物: [星(せい)][遺(い)][物(ぶつ)]
星間: [星(せい)][間(かん)]
春化精: [春(はる)][化(け)][精(しょう)]
時: [時(とき)]
時空: [時(じ)][空(くう)]
時計: [時(と)][計(けい)]
晴: [晴(せい)]
晴れ: [晴(は)]れ
暗: [暗(あん)]
暗黒: [暗(あん)][黒(こく)]
暗黒界: [暗(あん)][黒(こく)][界(かい)]
暴走: [暴(ぼう)][走(そう)]
曇: [曇(くも)]
書: [書(しょ)]
最高: [最(さい)][高(こう)]
月: [月(つき)]
朧車: [朧(おぼろ)][車(ぐるま)]
木遁: [木(もく)][遁(とん)]
未: [未(み)]
未来: [未(み)][来(らい)]
朱光の宣告者: [朱光の宣告者(バーミリオン・デクレアラー)]
条件: [条(じょう)][件(けん)]
枚: [枚(まい)]
染: [染(ぞ)]
核: [核(かく)]
桜: [桜(さくら)]
森: [森(もり)]
植物: [植(しょく)][物(ぶつ)]
楽: [楽(らく)]
模様: [模(も)][様(よう)]
権: [権(ごん)]
機巧: [機(き)][巧(こう)]
機械: [機(き)][械(かい)]
機甲: [機(き)][甲(こう)]
機皇: [機(き)][皇(こう)]
機関: [機(き)][関(かん)]
次: [次(つぎ)]
次元: [次(じ)][元(げん)]
正面: [正(しょう)][面(めん)]
武: [武(ブ)]
武力: [武力(ブリキ)]
武士道: [武(ぶ)][士(し)][道(どう)]
武神: [武(ぶ)][神(じん)]
死者: [死(し)][者(しゃ)]
残: [残(のこ)]
殺: [殺(さつ)]
毎: [毎(ごと)]
毒の: [毒(どく)]の
水: [水(みず)]
水晶機巧: [水晶機巧(クリストロン)]
水精鱗: [水精鱗(マーメイル)]
水遁: [水(すい)][遁(とん)]
氷: [氷(こおり)]
氷の: [氷(つらら)]の
氷獄: [氷(ひょう)][獄(ごく)]
氷結界: [氷(ひょう)][結(けっ)][界(かい)]
氷霊神: [氷(ひょう)][霊(れい)][神(しん)]
永続: [永(えい)][続(ぞく)]
決: [決(き)]
泡影: [泡(ほう)][影(よう)]
波: [波(は)]
波旬: [波(は)][旬(じゅん)]
注意: [注(ちゅう)][意(い)]
洞: [洞(どう)]
派: [派(は)]
流: [流(る)]
海晶乙女: [海晶乙女(マリンセス)]
海皇: [海(かい)][皇(おう)]
海竜: [海(かい)][竜(りゅう)]
海造賊: [海造賊(プランドロール)]
深海: [深(しん)][海(かい)]
混沌: [混(こん)][沌(とん)]
満た: [満(み)]た
準備: [準(じゅん)][備(び)]
溟界: [溟(めい)][界(かい)]
滅: [滅(ほろ)]
滓: [滓(おり)]
演: [演(えん)]
火遁: [火(か)][遁(とん)]
灰: [灰(は)]
炎: [炎(ほのお)]
炎星: [炎(えん)][星(せい)]
烈: [烈(れっ)]
烏: [烏(う)]
焔聖: [焔(えん)][聖(せい)]
無: [無(む)]
無効: [無(む)][効(こう)]
無欲: [無(む)][欲(よく)]
無限: [無(む)][限(げん)]
照: [照(しょう)]
熾天: [熾(し)][天(てん)]
爆裂疾風弾: [爆裂疾風弾(バーストストリーム)]
爬虫類: [爬(は)][虫(ちゅう)][類(るい)]
片方: [片(かた)][方(ほう)]
牛頭: [牛(ご)][頭(ず)]
特有: [特(とく)][有(ゆう)]
特殊: [特(とく)][殊(しゅ)]
状態: [状(じょう)][態(たい)]
狐: [狐(こ)]
狸: [狸(だぬき)]
猫: [猫(ねこ)]
獣: [獣(けもの)]
獣戦士: [獣(じゅう)][戦(せん)][士(し)]
獣王アルファ: [獣(しし)][王(おう)]アルファ
獣騎: [獣(じゅう)][騎(き)]
王: [王(おう)]
現: [現(げん)]
現世: [現(げん)][世(せ)]
生け: [生(い)]け
生ま: [生(う)]ま
生命: [生(せい)][命(めい)]
生者: [生(せい)][者(じゃ)]
甲虫装機: [甲虫装機(インゼクター)]
申: [申(もう)]
界: [界(かい)]
番兵: [番(ばん)][兵(ぺい)]
異な: [異(こと)]な
異次元: [異(い)][次(じ)][元(げん)]
発: [発(はつ)]
発動: [発(はつ)][動(どう)]
発動時: [発(はつ)][動(どう)][時(じ)]
発生: [発(はっ)][生(せい)]
白き宿命: [白(しろ)]き[宿命(さだめ)]
皇: [皇(おう)]
目: [目(め)]
直接: [直(ちょく)][接(せつ)]
相手: [相(あい)][手(て)]
真六武衆: [真(しん)][六(ろく)][武(ぶ)][衆(しゅう)]
真紅眼の飛竜: [真紅眼の飛竜(レッドアイズ・ワイバーン)]
真紅眼の黒竜: [真紅眼の黒竜(レッドアイズ・ブラックドラゴン)]
真青眼の究極竜: [真青眼の究極竜(ネオ・ブルーアイズ・アルティメットドラゴン)]
眩: [眩(まばゆ)]
眷: [眷(けん)]
睡蓮: [睡(すい)][蓮(れん)]
知: [知(し)]
砂: [砂(さ)]
砂漠の飛蝗賊: [砂漠の飛蝗賊(デザート・ローカスト)]
研究所: [研(けん)][究(きゅう)][所(じょ)]
砦: [砦(とりで)]
破壊: [破(は)][壊(かい)]
破壊力: [破(は)][壊(かい)][力(りょく)]
破械: [破(は)][械(かい)]
破滅: [破(は)][滅(めつ)]
破滅獣: [破(は)][滅(めつ)][獣(じゅう)]
確認: [確(かく)][認(にん)]
神: [神(かみ)]
神官: [神(しん)][官(かん)]
神獣: [神(しん)][獣(じゅう)]
神鳥: [神鳥(シムルグ)]
神龍: [神(しん)][龍(りゅう)]
禁じ: [禁(ぞう)]じ
禁忌: [禁(きん)][忌(き)]
禁斷: [禁(きん)][斷(だん)]
秤: [秤(びん)]
移: [移(うつ)]
移動: [移(い)][動(どう)]
種族: [種(しゅ)][族(ぞく)]
種類: [種(しゅ)][類(るい)]
穴: [穴(あな)]
究極: [究(きゅう)][極(きょく)]
空域: [空(くう)][域(いき)]
空牙団: [空(くう)][牙(が)][団(だん)]
竜: [竜(りゅう)]
竜儀巧: [竜儀巧(ドライトロン)]
竜星: [竜(りゅう)][星(せい)]
竜輝巧: [竜輝巧(ドライトロン)]
竜魂: [竜(りゅう)][魂(こん)]
簡易融合: [簡易融合(インスタントフュージョン)]
粉砕: [粉(ふん)][砕(さい)]
精神: [精(せい)][神(しん)]
精鋭: [精(せい)][鋭(えい)]
精霊: [精(せい)][霊(れい)]
紅: [紅(あか)]
紅蓮: [紅(ぐ)][蓮(れん)]
紋章獣: [紋(もん)][章(しょう)][獣(じゅう)]
素材: [素(そ)][材(ざい)]
終了: [終(しゅう)][了(りょう)]
終了時: [終(しゅう)][了(りょう)][時(じ)]
終末: [終(しゅう)][末(まつ)]
終焉: [終(しゅう)][焉(えん)]
組み: [組(く)]み
結晶の女神: [結晶の女神(マギストス・ゴッデス)]
結束: [結(けっ)][束(そく)]
結界: [結(けっ)][界(かい)]
絶対: [絶(ぜっ)][対(たい)]
続け: [続(つづ)]け
網: [網(もう)]
緊急: [緊(きん)][急(きゅう)]
縦列: [縦(じゅう)][列(れつ)]
繰り出: [繰(く)]り[出(だ)]
繰り返: [繰(く)]り[返(かえ)]
罠: [罠(トラップ)]
置: [置(お)]
美し: [美(うつく)]し
羽根: [羽(は)][根(ね)]
翼の: [翼(つばさ)]の
翼神竜: [翼(よく)][神(しん)][竜(りゅう)]
耀: [耀(よう)]
者: [者(もの)]
聖: [聖(せい)]
聖刻: [聖(せい)][刻(こく)]
聖霊: [聖(せい)][霊(れい)]
聖魔の乙女: [聖魔の乙女(マギストス・メイデン)]
能: [能(のう)]
自分: [自(じ)][分(ぶん)]
自身: [自(じ)][身(しん)]
花札衛: [花札衛(カーディアン)]
英雄: [英(えい)][雄(ゆう)]
華麗: [華(か)][麗(れい)]
落: [落(お)]
蘇生: [蘇(そ)][生(せい)]
虎: [虎(こ)]
虹: [虹(にじ)]
蛇: [蛇(じゃ)]
蜘蛛: [蜘(ぐ)][蛛(も)]
融合: [融(ゆう)][合(ごう)]
蟲惑魔: [蟲(こ)][惑(わく)][魔(ま)]
血: [血(ち)]
行: [行(おこな)]
術: [術(じゅつ)]
表: [表(おもて)]
表側: [表(おもて)][側(がわ)]
表示: [表(ひょう)][示(じ)]
裁判: [裁(さい)][判(ばん)]
装備: [装(そう)][備(び)]
裏: [裏(うら)]
裏側: [裏(うら)][側(がわ)]
補給: [補(ほ)][給(きゅう)]
覇: [覇(は)]
見: [見(み)]
覚醒: [覚(かく)][醒(せい)]
解放: [解(かい)][放(ほう)]
計り: [計(はか)]り
計算: [計(けい)][算(さん)]
計算時: [計(けい)][算(さん)][時(じ)]
記: [記(しる)]
記憶: [記(き)][憶(おく)]
誇: [誇(ほこ)]
調律: [調(ちょう)][律(りつ)]
謙虚: [謙(けん)][虚(きょ)]
護: [護(ご)]
象: [象(そう)]
貪欲: [貪(どん)][欲(よく)]
賢者: [賢(けん)][者(じゃ)]
贄: [贄(にえ)]
起動: [起(き)][動(どう)]
超: [超(ちょう)]
超量: [超(ちょう)][量(りょう)]
身: [身(しん)]
軍: [軍(ぐん)]
転生炎獣: [転生炎獣(サラマングレイト)]
輝: [輝(かがや)]
輪: [輪(りん)]
轍の: [轍(わだち)]の
轟: [轟(ごう)]
轟雷: [轟(ごう)][雷(らい)]
込: [込(こ)]
辿: [辿(たど)]
送: [送(おく)]
逆転: [逆(ぎゃく)][転(てん)]
通告: [通(つう)][告(こく)]
通常: [通(つう)][常(じょう)]
速攻: [速(そっ)][攻(こう)]
連絡: [連(れん)][絡(らく)]
連鎖: [連(れん)][鎖(さ)]
遊行: [遊(ゆう)][行(こう)]
運命: [運(うん)][命(めい)]
道: [道(どう)]
違: [違(ちが)]
適用: [適(てき)][用(よう)]
遷: [遷(せん)]
選: [選(えら)]
選別: [選(せん)][別(べつ)]
選択: [選(せん)][択(たく)]
部隊: [部(ぶ)][隊(たい)]
郷: [郷(きょう)]
都市: [都(と)][市(し)]
里: [里(さと)]
重ね: [重(かさ)]ね
重機: [重(じゅう)][機(き)]
量子: [量(りょう)][子(し)]
金剛: [金(こん)][剛(ごう)]
金満: [金(きん)][満(まん)]
鉄獣戦線: [鉄獣戦線(トライブリゲード)]
銀: [銀(ぎん)]
銀河眼の光波竜: [銀河眼の光波竜(ギャラクシーアイズ・サイファー・ドラゴン)]
鋼核: [鋼(こう)][核(かく)]
閃刀: [閃(せん)][刀(とう)]
閃刀姫: [閃(せん)][刀(とう)][姫(き)]
閃刀機: [閃(せん)][刀(とう)][機(き)]
閉ザサレシ世界ノ冥神: [閉ザサレシ世界ノ冥神(サロス＝エレス・クルヌギアス)]
開始: [開(かい)][始(し)]
開始時: [開(かい)][始(し)][時(じ)]
間: [間(あいだ)]
関: [関(かん)]
闇: [闇(やみ)]
阿吽: [阿(あ)][吽(うん)]
降臨: [降(こう)][臨(りん)]
限: [限(かぎ)]
陣: [陣(じん)]
除: [除(のぞ)]
除外: [除(じょ)][外(がい)]
際: [際(さい)]
障壁: [障(しょう)][壁(へき)]
隠: [隠(がく)]
隣: [隣(となり)]
離れ: [離(はな)]れ
雨: [雨(あめ)]
雪: [雪(ゆき)]
雪女: [雪(ゆき)][女(おんな)]
雪獄: [雪(せつ)][獄(ごく)]
雲竜: [雲(うん)][竜(りゅう)]
零: [零(レイ)]
零氷の: [零(れい)][氷(ひょう)]の
雷: [雷(いかずち)]
雷天気: [雷(らい)][天(てん)][気(き)]
雷遁: [雷(らい)][遁(とん)]
電光: [電(でん)][光(こう)]
電子光虫: [電子光虫(デジタル・バグ)]
電脳: [電(でん)][脳(のう)]
霊: [霊(れい)]
霊獣: [霊(れい)][獣(じゅう)]
霊神: [霊(れい)][神(しん)]
青眼の亜白龍: [青眼の亜白龍(ブルーアイズ・オルタナティブ・ホワイト・ドラゴン)]
青眼の光龍: [青眼の光龍(ブルーアイズ・シャイニングドラゴン)]
青眼の双爆裂龍: [青眼の双爆裂龍(ブルーアイズ・ツイン・バースト・ドラゴン)]
青眼の白龍: [青眼の白龍(ブルーアイズ・ホワイト・ドラゴン)]
青眼の究極亜竜: [青眼の究極亜竜(ブルーアイズ・オルタナティブ・アルティメットドラゴン)]
青眼の究極竜: [青眼の究極竜(ブルーアイズ・アルティメットドラゴン)]
順番: [順(じゅん)][番(ばん)]
願: [願(ねが)]
風: [風(かぜ)]
風来: [風(ふう)][来(らい)]
餓者: [餓(が)][者(しゃ)]
馬頭: [馬(め)][頭(ず)]
騎士: [騎(き)][士(し)]
骸の: [骸(むくろ)]の
髑髏: [髑(どく)][髏(ろ)]
高: [高(たか)]
鬼: [鬼(き)]
魁: [魁(かい)]
魂: [魂(たましい)]
魅惑: [魅(み)][惑(わく)]
魔: [魔(ま)]
魔妖: [魔妖(まやかし)]
魔導: [魔(ま)][導(どう)]
魔導獣: [魔導獣(マジックビースト)]
魔弾: [魔(ま)][弾(だん)]
魔法: [魔(ま)][法(ほう)]
魔獣: [魔(ま)][獣(じゅう)]
魔界: [魔(ま)][界(かい)]
魔術: [魔(ま)][術(じゅつ)]
魔轟神: [魔(ま)][轟(ごう)][神(しん)]
魔鍾: [魔(ま)][鍾(しょう)]
魚: [魚(さかな)]
鳥: [鳥(どり)]
鳥獣: [鳥(ちょう)][獣(じゅう)]
麗の: [麗(うるわし)]の
黄昏: [黄(たそ)][昏(がれ)]
黄金: [黄(おう)][金(ごん)]
黒: [黒(くろ)]
黒き覚醒: [黒(くろ)]き[覚醒(めざめ)]
龍: [龍(りゅう)]
`.trim()

const luas = {
    "96823189": `
--誇りと魂の龍
local s,id,o=GetID()
function s.initial_effect(c)
	c:EnableReviveLimit()
	--
	local e1=Effect.CreateEffect(c)
	e1:SetType(EFFECT_TYPE_SINGLE)
	e1:SetProperty(EFFECT_FLAG_CANNOT_DISABLE+EFFECT_FLAG_UNCOPYABLE)
	e1:SetCode(EFFECT_SPSUMMON_CONDITION)
	c:RegisterEffect(e1)
	--
	local e2=Effect.CreateEffect(c)
	e2:SetDescription(aux.Stringid(id,0))
	e2:SetType(EFFECT_TYPE_FIELD)
	e2:SetCode(EFFECT_SPSUMMON_PROC)
	e2:SetRange(LOCATION_HAND)
	e2:SetProperty(EFFECT_FLAG_CANNOT_DISABLE+EFFECT_FLAG_UNCOPYABLE)
	e2:SetCondition(s.condition)
	c:RegisterEffect(e2)
	--
	local e3=Effect.CreateEffect(c)
	e3:SetType(EFFECT_TYPE_SINGLE)
	e3:SetCode(EFFECT_UPDATE_ATTACK)
	e3:SetRange(LOCATION_MZONE)
	e3:SetProperty(EFFECT_FLAG_SINGLE_RANGE)
	e3:SetCondition(s.atkcon)
	e3:SetValue(2500)
	c:RegisterEffect(e3)
	local e4=e3:Clone()
	e4:SetCode(EFFECT_UPDATE_DEFENSE)
	c:RegisterEffect(e4)
end
function s.condition(e,c)
	if c==nil then return true end
	local tp=c:GetControler()
	return Duel.GetLocationCount(tp,LOCATION_MZONE)>0 and Duel.GetFieldGroupCount(tp,0,LOCATION_GRAVE)>=25
end
function s.atkcon(e)
	return Duel.GetFieldGroupCount(e:GetHandlerPlayer(),LOCATION_GRAVE,0)>=25
end
`.trim(),
    "19652159": `
--光と闇の竜王
local s,id,o=GetID()
function s.initial_effect(c)
	aux.AddFusionProcFun2(c,s.mfilter1,s.mfilter2,true)
	c:EnableReviveLimit()
	local e0=Effect.CreateEffect(c)
	e0:SetType(EFFECT_TYPE_SINGLE)
	e0:SetProperty(EFFECT_FLAG_CANNOT_DISABLE+EFFECT_FLAG_UNCOPYABLE)
	e0:SetCode(EFFECT_SPSUMMON_CONDITION)
	e0:SetValue(aux.fuslimit)
	c:RegisterEffect(e0)
	--
	local e1=Effect.CreateEffect(c)
	e1:SetDescription(aux.Stringid(id,0))
	e1:SetType(EFFECT_TYPE_SINGLE)
	e1:SetProperty(EFFECT_FLAG_SINGLE_RANGE)
	e1:SetCode(EFFECT_ADD_ATTRIBUTE)
	e1:SetRange(LOCATION_MZONE)
	e1:SetValue(ATTRIBUTE_DARK)
	c:RegisterEffect(e1)
	--
	local e2=Effect.CreateEffect(c)
	e2:SetDescription(aux.Stringid(id,1))
	e2:SetCategory(CATEGORY_NEGATE)
	e2:SetType(EFFECT_TYPE_QUICK_F)
	e2:SetCode(EVENT_CHAINING)
	e2:SetProperty(EFFECT_FLAG_DAMAGE_STEP+EFFECT_FLAG_DAMAGE_CAL)
	e2:SetRange(LOCATION_MZONE)
	e2:SetCountLimit(1,EFFECT_COUNT_CODE_CHAIN)
	e2:SetCondition(s.negcon)
	e2:SetTarget(s.negtg)
	e2:SetOperation(s.negop)
	c:RegisterEffect(e2)
	--
	local e3=Effect.CreateEffect(c)
	e3:SetDescription(aux.Stringid(id,2))
	e3:SetCategory(CATEGORY_SPECIAL_SUMMON)
	e3:SetType(EFFECT_TYPE_SINGLE+EFFECT_TYPE_TRIGGER_O)
	e3:SetProperty(EFFECT_FLAG_CARD_TARGET+EFFECT_FLAG_DELAY)
	e3:SetCode(EVENT_DESTROYED)
	e3:SetCondition(s.spcon)
	e3:SetTarget(s.sptg)
	e3:SetOperation(s.spop)
	c:RegisterEffect(e3)
end
function s.mfilter1(c)
	return c:IsFusionAttribute(ATTRIBUTE_LIGHT) and c:IsLevel(8) and c:IsRace(RACE_DRAGON)
end
function s.mfilter2(c)
	return c:IsFusionAttribute(ATTRIBUTE_DARK) and c:IsLevel(8) and c:IsRace(RACE_DRAGON)
end
function s.negcon(e,tp,eg,ep,ev,re,r,rp)
	return (re:IsHasType(EFFECT_TYPE_ACTIVATE) or re:IsActiveType(TYPE_MONSTER))
end
function s.negtg(e,tp,eg,ep,ev,re,r,rp,chk)
	local c=e:GetHandler()
	if chk==0 then return c:GetFlagEffect(id)==0 end
	if c:IsHasEffect(EFFECT_REVERSE_UPDATE) then
		c:RegisterFlagEffect(id,RESET_EVENT+RESETS_STANDARD+RESET_PHASE+PHASE_END,0,1)
	end
	Duel.SetOperationInfo(0,CATEGORY_NEGATE,eg,1,0,0)
end
function s.negop(e,tp,eg,ep,ev,re,r,rp)
	local c=e:GetHandler()
	if c:IsFacedown() or not c:IsRelateToEffect(e) or c:GetAttack()<1000 or c:GetDefense()<1000
		or c:IsStatus(STATUS_BATTLE_DESTROYED) then
		return
	end
	local e1=Effect.CreateEffect(c)
	e1:SetType(EFFECT_TYPE_SINGLE)
	e1:SetProperty(EFFECT_FLAG_COPY_INHERIT)
	e1:SetCode(EFFECT_UPDATE_ATTACK)
	e1:SetReset(RESET_EVENT+RESETS_STANDARD+RESET_DISABLE)
	e1:SetValue(-1000)
	c:RegisterEffect(e1)
	local e2=e1:Clone()
	e2:SetCode(EFFECT_UPDATE_DEFENSE)
	c:RegisterEffect(e2)
	if not c:IsHasEffect(EFFECT_REVERSE_UPDATE) and Duel.GetCurrentChain()==ev+1 then
		Duel.NegateActivation(ev)
	end
end
function s.spcon(e,tp,eg,ep,ev,re,r,rp)
	local c=e:GetHandler()
	return rp==1-tp and c:IsPreviousControler(tp)
end
function s.spfilter(c,e,tp)
	return c:IsRace(RACE_DRAGON) and c:IsCanBeSpecialSummoned(e,0,tp,false,false)
end
function s.sptg(e,tp,eg,ep,ev,re,r,rp,chk,chkc)
	if chkc then return chkc:IsLocation(LOCATION_GRAVE) and chkc:IsControler(tp)
		and s.spfilter(chkc,e,tp) end
	if chk==0 then return Duel.GetLocationCount(tp,LOCATION_MZONE)>0 and Duel.IsExistingTarget(s.spfilter,tp,LOCATION_GRAVE,0,1,nil,e,tp) end
	Duel.Hint(HINT_SELECTMSG,tp,HINTMSG_SPSUMMON)
	local g=Duel.SelectTarget(tp,s.spfilter,tp,LOCATION_GRAVE,0,1,1,nil,e,tp)
	Duel.SetOperationInfo(0,CATEGORY_SPECIAL_SUMMON,g,1,0,0)
end
function s.spop(e,tp,eg,ep,ev,re,r,rp)
	local tc=Duel.GetFirstTarget()
	if tc and tc:IsRelateToEffect(e) then
		Duel.SpecialSummon(tc,0,tp,tp,false,false,POS_FACEUP)
	end
end
`.trim()
}

export const DEFAULT_PACKAGE_NAME = 'MyDIY'
export let default_values = {
	"packages": { [DEFAULT_PACKAGE_NAME]: { variable: { last_text_filename: DEFAULT_PACKAGE_NAME + ".txt", data_version: 1 } }},
    "last_package": DEFAULT_PACKAGE_NAME,
    "config": {
		"auto_remove_newline": true,
        "not_effect_rules": "^[-—].*\n^.{2,4}[:：].*\n^\\(.*\\)$\n^（.*）$\n^.*DoItYourself.*$",
        "strings": strings,
		"ofurus": ofurus
    }
}

export let mydiy_values = {
    [DEFAULT_PACKAGE_NAME + ".txt"]: `
青眼白龙(89631141=>89631139) 光 8星 龙/通常 3000 2500
以高攻击力著称的传说之龙。任何对手都能粉碎，其破坏力不可估量。

骄傲与灵魂之龙(96823189) 暗 8星 龙/特殊召唤 2500 2500 (OCG)
这张卡不能通常召唤。对方墓地有卡25张以上存在的场合才能特殊召唤。①：只要自己墓地有卡25张以上存在，这张卡的攻击力·守备力上升2500。
提示文本：特殊召唤

光与暗之龙王(19652159) 光 10星 龙/融合 3400 3000
龙族·光属性·8星怪兽＋龙族·暗属性·8星怪兽
这张卡不用融合召唤不能特殊召唤。
①：只要这张卡在怪兽区域存在，这张卡的属性也当作「暗」使用。
②：怪兽的效果·魔法·陷阱卡发动时发动（同一连锁上最多1次）。这张卡的攻击力·守备力下降1000，那个发动无效。
③：这张卡被对方破坏的场合，以自己墓地1只龙族怪兽为对象才能发动。那只怪兽特殊召唤。
效果分类：攻守变化、特殊召唤、属性相关、效果无效
提示文本：属性当作暗、发动无效、墓地特殊召唤
`.trim(),
    "script/c96823189.lua": luas[96823189],
    "script/c19652159.lua": luas[19652159],
    "pico/89631141.jpg": import.meta.env.BASE_URL + "examples/89631141.jpg",
    "pico/96823189.jpg": import.meta.env.BASE_URL + "examples/96823189.jpg",
    "pico/19652159.jpg": import.meta.env.BASE_URL + "examples/19652159.jpg"
}
