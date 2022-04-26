var id_titleid;
var id_output;
var id_np_environment;

var urls = [];
var np_environment_list = ["np", "mgmt", "e1-np", "e2-np", "sp-int", "prod-qa"];

var ps4_game_update_hmac_key = [
    0xAD, 0x62, 0xE3, 0x7F, 0x90, 0x5E, 0x06, 0xBC, 0x19, 0x59, 0x31, 0x42, 0x28, 0x1C, 0x11, 0x2C,
    0xEC, 0x0E, 0x7E, 0xC3, 0xE9, 0x7E, 0xFD, 0xCA, 0xEF, 0xCD, 0xBA, 0xAF, 0xA6, 0x37, 0x8D, 0x84
];


function ScePageLoad() {
    id_titleid = document.getElementById("titleid");
    id_output = document.getElementById("output");
    id_np_environment = document.getElementById("np_environment");

    urls[0] = "http://";
    urls[1] = "gs-sec.";
    urls[2] = "ww.";
    urls[3] = null;    /* NP Environment */
    urls[4] = ".dl";
    urls[5] = ".playstation.net/";
    urls[6] = "plo/";
    urls[7] = null;    /* TitleId */
    urls[8] = "-ver.xml";

    np_environment_list.forEach(x => { 
        var item = document.createElement('option');
        item.value = x;
        item.appendChild(document.createTextNode(x));
        id_np_environment.appendChild(item);
    });

}


function SceInputCheck() {
    id_titleid.value = id_titleid.value.toUpperCase();
    if (id_titleid.value.length == 9) {
        SceGameGetUpdatePkgUrl();
    } else {
        id_output.innerHTML = "";
    }
}


function SceGameGetUpdatePkgUrl() {
    var TitleId = id_titleid.value;
    var NP_Environment = id_np_environment.value;
    HMAC_SHA256_init(ps4_game_update_hmac_key);

    if (0) {
        /* Debug Mode */
        console.log("Debug Mode");
        var np_environment_title_byte = [];
        var np_environment_title = NP_Environment + "_" + TitleId;
        for (var i = 0; i < np_environment_title.length; i++){
            np_environment_title_byte[i] = np_environment_title.charCodeAt(i);
        }
        HMAC_SHA256_write(np_environment_title_byte);

    } else {
        /* Normal Mode */
        HMAC_SHA256_write(NP_Environment + "_" + TitleId);
    }

    var ArrayIsHmacSha256 = HMAC_SHA256_finalize();
    var StringIsHmacSha256 = "";

    for (var i = 0; i < ArrayIsHmacSha256.length; i++) {
        StringIsHmacSha256 += chk(ArrayIsHmacSha256[i], 16);
    }

    urls[3] = NP_Environment;
    urls[7] = TitleId;
    var Ps4GameUpdatePkgUri = urls[0] + urls[1] + urls[2] + urls[3] + urls[4] + urls[5] + urls[6] + urls[3] + "/" + urls[7] + "/" + StringIsHmacSha256 + "/" + urls[7] + urls[8];
    id_output.innerHTML = "";
    var eA = document.createElement('a');
    eA.href = Ps4GameUpdatePkgUri;
    eA.appendChild(document.createTextNode(Ps4GameUpdatePkgUri));
    id_output.appendChild(eA);
}


function chk(a1, a2) {
    var input_value = a1;
    a1 = a1.toString(a2);
    if (input_value <= 0xF){
        a1 = "0" + a1;
    }
    return a1;
}
