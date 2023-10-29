Hooks.once("init", async () => {
    game.settings.register("aff2-jp", "UseAff2Command", {
        name: "Aff コマンド",
        hint: "Aff で使うコマンドをeval※関数を使って実装「/aff」で簡易ヘルプを表示。※eval関数を使用しているので取り扱い要注意",
        type: Boolean,
        scope: 'world',
        default: false,
        config: true
    });
});


Hooks.on("chatMessage", (html, content, msg) => {
    let aff = game.settings.get("aff2-jp", "UseAff2Command");
    if (aff) {
        // Setup new message's visibility
        let rollMode = game.settings.get("core", "rollMode");
        if (["gmroll", "blindroll"].includes(rollMode)) msg["whisper"] = ChatMessage.getWhisperRecipients("GM").map(u => u.id);
        if (rollMode === "blindroll") msg["blind"] = true;

        let regExp;
        regExp = /(\S+)/g;
        let commands = content.match(regExp);

        // ここにコメント取得ソースを入れる
        // if (commands[Array.length - 1] === "")

        if (commands[0] === "/aff") {
            if (commands[1] === "ft") {
                let dice1 = Math.floor(Math.random() * 5) + 1;
                let dice2 = Math.floor(Math.random() * 5) + 1;
                let dice = dice1 + dice2;
                if (commands[2] !== undefined) {
                    let value = eval(commands[2]);
                    let result = "失敗";
                    if (dice < value) { result = "成功" }
                    msg.content = `<b>${result}：</b>${value} (${commands[2]}) > <b>${dice}</b> = 2d6 ( ${dice1} + ${dice2} )`;
                    ChatMessage.create(msg);
                    return false
                }
            } else if (commands[1] === "fo") {
                let dice1 = Math.floor(Math.random() * 5) + 1;
                let dice2 = Math.floor(Math.random() * 5) + 1;
                if (commands[2] !== undefined) {
                    let value = eval(commands[2]);
                    let dice = dice1 + dice2 + value;
                    if (dice < value) { result = "成功" }
                    msg.content = `<b>結果：${dice}</b> = 2d6 ( ${dice1} + ${dice2} ) + ${commands[2]}`;
                    ChatMessage.create(msg);
                    return false
                }

                return false
            } else if (commands[1] === "fr") {
                // /aff fr [1,2,3,4,5,6,7]
                if (commands[2] !== undefined) {
                    if (commands[2].substr(0, 1) === '[') {
                        let dice = Math.floor(Math.random() * 5);
                        let dice1 = dice;
                        let mod = "";
                        let retVal = null;
                        if (commands[3] !== undefined) {
                            mod = commands[3]
                            dice1 = dice1 + eval(mod)
                        }
                        let retArr = commands[2].substr(1, commands[2].length - 2).split(',');
                        if (retArr.length < dice1) {
                            retVal = retArr.slice(-1)[0]
                        } else {
                            retVal = retArr[dice1]
                        }
                        if (mod === "") {
                            msg.content = `<b>結果：${retVal}</b> = 1d6(${dice + 1}) ${commands[2]}</ br>`;
                            ChatMessage.create(msg);
                        } else {
                            msg.content = `<b>結果：${retVal}</b> = 1d6(${dice + 1}) ${mod} ${commands[2]}</ br>`;
                            ChatMessage.create(msg);
                        }
                        return false;
                    }
                }
            }

            msg.content = `書式：/aff オプション 引数<br>通常ロール：ft {目標値}<br />対抗ロール：fo {数値}+{修正値}<br />レート表：fr [数式1,数式2,...,数式7] {修正値}`;
            ChatMessage.create(msg);
            return false
        }
    }
});
