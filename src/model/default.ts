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
        "not_effect_rules": "^[-—].*\n^.{2,4}[:：].*\n^\\(.*\\)$\n^（.*）$\n^.*DoItYourself.*$",
        "strings": strings
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
