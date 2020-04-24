'use strict';
const fs = require('fs');
const readline = require('readline');
const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({ input: rs, out: {} });
const prefectureDataMap = new Map(); // 連想配列 key: 都道府県 value: 集計データのオブジェクト
//rl.on('line', lineString => {  // 1行ずつ読み込む
//    console.log(lineString);
//});
rl.on('line', lineString => {  //集計年、都道府県、15～19歳の人口 をそれぞれ1行ずつ
    const columns = lineString.split(',');  //"ab,cde,f" → ["ab", "cde", "f"]  (文字列を分割して配列に)
    const year = parseInt(columns[0]);  //集計年 文字列→数値
    const prefecture = columns[1];      //都道府県
    const popu = parseInt(columns[3]);  //15～19歳の人口 文字列→数値
    if(year === 2010 || year === 2015){
        //console.log(year);
        //console.log(prefecture);
        //console.log(popu);
        let value = prefectureDataMap.get(prefecture); //同じ県のデータがあれば取得
        if(!value){   //この県のデータを処理するのが初めてなら(Falsyなら)初期値設定
            value = {
                popu10: 0,
                popu15: 0,
                change: null
            };
        }
        if(year === 2010){
            value.popu10 = popu;  //連想配列に保存
        }
        if(year === 2015){
            value.popu15 = popu;  //連想配列に保存
        }
        prefectureDataMap.set(prefecture, value)
    }
});
rl.on('close', () => {    //closeイベントは全ての行を読み込み終わったら発動
    for(let [key, value] of prefectureDataMap){
        value.change = value.popu15 / value.popu10;  //valueのchangeプロパに変化率の計算
    }
    //console.log(prefectureDataMap);

    const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
        return pair2[1].change - pair1[1].change;   //高い順に並び変え
    });
    //console.log(rankingArray);
    const rankingStrings = rankingArray.map(([key, value]) => {   //map関数でありMapではない
        return (key + '; ' + value.popu10 + '=>' + value.popu15 + ' 変化率:' + value.change); //整形
    });
    console.log(rankingStrings);
});