'use strict';
var getAES = require('../src/aes-generator.js');
var key = '2b7e151628aed2a6abf7158809cf4f3c';
var fs = require('fs');

function generateAes(k, options) {
    var code = getAES(k, options);
    fs.writeFileSync(options.file, code);
}

generateAes(key, {encoding: 'hex', file: 'test/fixtures/wbaes-smoke.js'});

var bAes = require('./fixtures/wbaes-smoke.js');

function basicEncryptionTest(aes, text) {
    return aes.decrypt(aes.encrypt(text));
}

module.exports = {
    'Base AES, english text': function(test) {
        var text = 'You can do anything, but not everything.';
        test.expect(1);
        test.strictEqual(basicEncryptionTest(bAes, text), text);
        test.done();
    },
    'Base AES, russian text': function(test) {
        var text = 'Быть энтузиасткой сделалось ее общественным положением, и иногда, когда ей даже того не хотелось, она, чтобы не обмануть ожиданий людей, знавших ее, делалась энтузиасткой.';
        test.expect(1);
        test.strictEqual(basicEncryptionTest(bAes, text), text);
        test.done();
    },
    'Base AES, empty text': function(test) {
        var text = '';
        test.expect(1);
        test.strictEqual(basicEncryptionTest(bAes, text), text);
        test.done();
    },
    'Base AES, some special characters': function(test) {
        var text = '!@#$%^&*()_+';
        test.expect(1);
        test.strictEqual(basicEncryptionTest(bAes, text), text);
        test.done();
    },
    'Base AES, NIST SP800-38a': function(test) {
        /*
         * key:            2b7e151628aed2a6abf7158809cf4f3c
         * Init. Counter:  f0f1f2f3f4f5f6f7f8f9fafbfcfdfeff
         * Plaintext:      6bc1bee22e409f96e93d7e117393172a
         * Ciphertext:     874d6191b620e3261bef6864990db6ce
         * http://csrc.nist.gov/publications/nistpubs/800-38a/sp800-38a.pdf
         */
        test.expect(1);
        test.strictEqual(bAes.encrypt('6bc1bee22e409f96e93d7e117393172a', {counter: 'f0f1f2f3f4f5f6f7f8f9fafbfcfdfeff', encoding: 'hex'}).substring(32), '874d6191b620e3261bef6864990db6ce');
        test.done();
    },
    'Base AES, Test vector 1': function(test) {
        // http://www.inconteam.com/software-development/41-encryption/55-aes-test-vectors#aes-crt-128
        test.expect(1);
        test.strictEqual(bAes.encrypt('ae2d8a571e03ac9c9eb76fac45af8e51', {counter: 'f0f1f2f3f4f5f6f7f8f9fafbfcfdfeff', encoding: 'hex'}).substring(32), '42a155248663d02c6c6579d9af312fb5');
        test.done();
    },
    'Base AES, Test vector 2': function(test) {
        // http://www.inconteam.com/software-development/41-encryption/55-aes-test-vectors#aes-crt-128
        test.expect(1);
        test.strictEqual(bAes.encrypt('30c81c46a35ce411e5fbc1191a0a52ef', {counter: 'f0f1f2f3f4f5f6f7f8f9fafbfcfdfeff', encoding: 'hex'}).substring(32), 'dc44c3353b3c98a11729d76cf094f30b');
        test.done();
    },
    'Base AES, Test vector 3': function(test) {
        // http://www.inconteam.com/software-development/41-encryption/55-aes-test-vectors#aes-crt-128
        test.expect(1);
        test.strictEqual(bAes.encrypt('f69f2445df4f9b17ad2b417be66c3710', {counter: 'f0f1f2f3f4f5f6f7f8f9fafbfcfdfeff', encoding: 'hex'}).substring(32), '1a13fb36472fe7a75ff9570e0cf296f4');
        test.done();
    },
    'RFC 3686, Test vector 1': function(test) {
        // https://tools.ietf.org/html/rfc3686#page-9
        var key = 'ae6852f8121067cc4bf7a5765577f39e';
        generateAes(key, {encoding: 'hex', file: 'test/fixtures/wbaes-rfc3686-1.js'});
        var rfcAes = require('./fixtures/wbaes-rfc3686-1.js');
        test.expect(1);
        test.strictEqual(rfcAes.encrypt('53696e676c6520626c6f636b206d7367', {counter: '00000030000000000000000000000001', encoding: 'hex'}).substring(32), 'e4095d4fb7a7b3792d6175a3261311b8');
        test.done();
    },
    'RFC 3686, Test vector 2': function(test) {
        // https://tools.ietf.org/html/rfc3686#page-9
        var key = '7e24067817fae0d743d6ce1f32539163';
        generateAes(key, {encoding: 'hex', file: 'test/fixtures/wbaes-rfc3686-2.js'});
        var rfcAes = require('./fixtures/wbaes-rfc3686-2.js');
        test.expect(1);
        test.strictEqual(rfcAes.encrypt('000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f', {counter: '006cb6dbc0543b59da48d90b00000001', encoding: 'hex'}).substring(32), '5104a106168a72d9790d41ee8edad388eb2e1efc46da57c8fce630df9141be28');
        test.done();
    },
    'RFC 3686, Test vector 3': function(test) {
        // https://tools.ietf.org/html/rfc3686#page-9
        var key = '7691be035e5020a8ac6e618529f9a0dc';
        generateAes(key, {encoding: 'hex', file: 'test/fixtures/wbaes-rfc3686-3.js'});
        var rfcAes = require('./fixtures/wbaes-rfc3686-3.js');
        test.expect(1);
        test.strictEqual(rfcAes.encrypt('000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20212223', {counter: '00e0017b27777f3f4a1786f000000001', encoding: 'hex'}).substring(32), 'c1cf48a89f2ffdd9cf4652e9efdb72d74540a42bde6d7836d59a5ceaaef3105325b2072f');
        test.done();
    },
    'MBS AES-CTR, Test Vector 1': function(test) {
        // http://www.ieee802.org/16/tge/contrib/C80216e-04_357.pdf
        var key = '0000000000000000ffffffffffffffff';
        generateAes(key, {encoding: 'hex', file: 'test/fixtures/wbaes-mbs-1.js'});
        var mbsAes = require('./fixtures/wbaes-mbs-1.js');
        test.expect(1);
        test.strictEqual(mbsAes.encrypt('d865c9cdea3356c5488e7ba15e84f4eba3b8259c053f24ce2967221c003884d79d4ca4877ffa4bc687c667e5495bcfec12f4871732aae45a110676113df9e7da', {counter: '22221a7022221a7022221a7022221a70', encoding: 'hex'}).substring(32), 'b672f2af6acc20aeee1ad814128c318b955bbe805b389249897600f5207454327d6d0fb4ac0a94f37ca09e45053398fea89c200ad358126d9e89a405265c96e7');
        test.done();
    },
    'MBS AES-CTR, Test Vector 2': function(test) {
        // http://www.ieee802.org/16/tge/contrib/C80216e-04_357.pdf
        var key = '0000000000000000ffffffffffffffff';
        generateAes(key, {encoding: 'hex', file: 'test/fixtures/wbaes-mbs-2.js'});
        var mbsAes = require('./fixtures/wbaes-mbs-2.js');
        test.expect(1);
        test.strictEqual(mbsAes.encrypt('8b61c384ab890b71efefb949bea45bb12b71e2d5553be55ab0f597a9dc71ed66d1b0ea7c38f4ec26e2a56f9f48ca4f733a31478f6b2ce91b217fc3fdf0b063c05f4c3c963f28bc21cc2bbf14f40e862e3ecdbca9f8a4c318238615123577d293c20e290035e421000edf1302ed992f2a65ead25c8e9574b01a88c24eff94e1c0a20ac0d6ede0d5fbbfe8fcab802ad5e414a740a23bb452553c13a33aa783f9488cb91d7998f27457da7001599ad63cad7c7c4fb72fa00b6ab3ada459309ca1bc55be34ecb0a842891743e1b0181d5d9498ab4ac74a5531fc01d4553170f6ecc4b320b063c7f2ebdd35cc8d4de8e9e080942a47de7f77da7f4b2fb0bb249b7fd7', {counter: '5cb44a055cb44a055cb44a055cb44a05', encoding: 'hex'}).substring(32), '8b347e8350f973011c93348b51b44387b56bb872b34578bdc61ffb461698f80bcdcdb3d22ab117c39df54958659eb57e567ab64af9460e6a3304faa8a1a2014ccdb3d87c49911b6bd59c87b46dbdee8d360c4ff767386e2aeb7c08544e12167439db143871f5544904f60e4acc7730eeffa997bff223ba2cc7daaa5a0d059d0c5aee9dd870f2dfd179c1a26d65fcbb59adf23d7f8f4ca8f4cef598bf1fc45cb7e882d65a28778d21b09794e892c4a52a78fecd0b5ca0355b7a444ac404bebb34b6cb74e4140808d80b876b10fa084a6c778b6ba1009e3f1bb0e76ffa066b2d47f47eabcf69143bf99792954442ee008e689c0f96c47538cc6a0f1dafd624571c');
        test.done();
    },
    'MBS AES-CTR, Test Vector 3': function(test) {
        // http://www.ieee802.org/16/tge/contrib/C80216e-04_357.pdf
        var key = '0000000000000000ffffffffffffffff';
        generateAes(key, {encoding: 'hex', file: 'test/fixtures/wbaes-mbs-3.js'});
        var mbsAes = require('./fixtures/wbaes-mbs-3.js');
        test.expect(1);
        test.strictEqual(mbsAes.encrypt('2e398020245d54efe9a0d7d27f5665a99c4327131ca65e4a55186ef09644a9c47d29e3a185368f6ed5653f54bba4fd57e6236a02c9c74c1edeb90d73fdb6367ade191a634ea9d0220e0e76c8b2721f979588995d4ee47b2c9d879f993cd5121aed2c7c3ad44b5ce159d1a90a42c8a1d74f39339d1dadc9b9346751703c6389288f0462624fbd43a78eecb0d0b350a60289d99fa585675db9ceae280911b0319fb49201024f43a8dc2f58abe2a851e3302981d5ade83165b5df8dbeef3cee8eef7f8ef1cdd199a9fff054e097a4c3c7cc449b792bccdee0ab6a9d99a68a269509b485d6841d7e830dd163a474256a406905b893d196737bff1014a5993939a2edbd7771daf4f3e7c5568a397bf478e3f83076c8c5e842c3f75568908ea0317b5da8eb369cde1d6033a698ae991090913f055903ed9ac6e4ef2d737dcca4f8284be25ee7c07a46f320dea0b8ed30492b34a12e213bf3042a1f77a7eb1a9e136580704c3fea9131096fd1c15c000a8734aab454e4a6580dc5ceb3afe851c14dd031980e1a293f23970fe4f30fed7942972c967ad1ee8796bb3a44a38a05ef593586674fafa67245b55637c343af05d9db9a53ab87da41421384e49d88d3f6bd595d0c07027d4bb6d2827815317ced0c163fb79d18f7df2b7ac2c80295bdbfed19caf31a473ed019c0472df1c319fcd958b27570a8539a22156124a91ee29636ac8850f2c5200a846737742a4f7002a7217716c8cab0eadf110d872eee1d6499a4b48b69d394ec39cb606219cf64c0f0dad5b7a385a08195ac08c29a242533c8d9bd30ab511ce41b7b46344aa9f33982c8f0254c90a5e03cada2d6d1c608989fc4c74914e22d2e5d7261a61a54df9c1bcfc0675e65469a12e76fe2ad76794b3a3f944e21c07b7d32dc234c3001e74ad0a7b12d0cf6c71ddd36ff8aab78d5e5b76832d728ad53598976a4b8768b024532b2723da8395a846e580d19d0e2fd86492f5c71dbafca63246e1b9af81cdf29ce51667589bff9f617060ee6e70b6c3039c8a0137769769bd69134cead13f77a635cefeb1be7e132ecee17d3f88302314aa144c00ab95ae0498eadf6a0a46f03ff5eed1a44ce4b30bb6202b3e403e32ea426edaddf478d28d53a1d74dd8c77dce963f52d31405deba15e9e856181b205a79fb286e63eadba77ca2e5456a42f3f07246b3763c8220426bf8887403a8be6d93d6bbe7b1877f1e2a445374873764e97e184f9a8a5fdcd648453a3bede89961af453940cca85ed6ec924b53c9903d27a86cb212bc7ed8f4b4032091dbb9e37aef1cab9bb4fa62818c9dd5362df25db64effc8fb6e91e01284f094509a67bb797457051931578aade54fd4032211a96101625c5fe42c52591cd6a9a73e4500a29c05abcd4d265b22662f158820bed922012571d531c42e4e9ac7d5b90cd65b88dbe73608fd812b539020cbb0cf94c2c0aa3495dbe8a40a635bd01c48a657c1623ee76b2c58766fe8971b8956904c072a608cf64920f09c7cb0a8b556e066a91f3e042b867a7b5ef176d84807144f2174bc07addce83a3998c2deefa33588a2537cbdd9d72928c89ff10086f53fa859db9ff7a87811c200c490d067b648fa09b5a7d38cc0ec4540dd35c7b255500c20eff3b957f57b48ba0c1901b251fbac07937f74445ba98518df3ccb147cc7354caaee948059cd2a45d62be82817841f9ae383df2f1d4437ec60e2e0dd9a161a24e49e952e5bbf5421cb3c39c2b0495d93bd1ca2ba50ca86a1ad677f276d793c4207c1504370a4553bd08efe70b83bf45548970f8951862aeeed9a064b03327cfaf3cd3e5451837011f26e829a9a66efc2fddf4c3f55671e22e1045dd426bacf0a67ed5eb950cecb431d3ddda794ad6a727c9691b1fdafd4ce941292bacd41a5252ef3de6fa28992bfb750473bfd919e5a28200c05cfc0c443d356ee808883a5976763f709dd89b974c9e090a7722ef18a4eed8ffe9e3432517b10d1f384678aebbb71e578eb8eed956f7e3cc19d1e4bdbfbbbca89efeccb5aed9d3e61e4b93d901b0308e681d67bd1449882c1a6be8d825a47fc3a14b774f244a344294c61a95764a23de67899a7ad222a6ec8c8ec4b1', {counter: '1826e4111826e4111826e4111826e411', encoding: 'hex'}).substring(32), '997d26f2bf10dcf34cb4e3c36379d05f5299fbfc3dbfa99c115eb02adef1e4c653974ab58e4ff881d40e0be679e1705bc096822241042ac867e38d1865278f524bcd050ec39259dd4dd9e3efa190c166eece419584b5371a54edc9e363c9ac67592ff30af77006d38d36d40700e8fddd1d0ecfd8d5609fdeb8915dedf97c0661e959504e1eaa53893270c7746e41b1d05ee8785dd8ada3b9da94981c6d7c613071e0fa609bff4571548b9c6011de5db9cca0e835793e0a9fd4089ff91b0a21a84a3990c407c4801b2c56cafb3eada60cf3498ff396b973a4e0efbb34b51ab969b481611ac016648d105ef2ff283635e67520a5009723d8f0969adf1becb21d8b77d6444d7228c448b646ad87c03a9f7679f4f0a8330823273d3c278298333dc7bf12b98a18767699508e614a9ea66088189463748fff14ecf5a5ff381384ffa4762d1c8c45ad9814d549fd32f942f3751e57c1544372e2fe916ee5363e08209fa44f61a3e0a1fd025d0c47ec8cac76ef8bed60e58f418f116a42875c43c58fe38936c791493fdf46173eecd29a80c2eb63abe3633373bdfde18d533179b7e8c45f1b4b87883376d53cbbcfbfd7274bbc9f05a232698f95559018d9a865fc033e44637f216bcac67f96f1d2c5ac0c9625d96315e60dd65bd76d8e3777a727c7bbe8a0173e1e36a57ce57e916285d5cf9720322ba772f1d554a8b5ead48d3d760a2f9230d83ed0f35235f3bc8b06a71341c4e851e553a2e50528d89296a2c5ba87f020f7256cb9c75c21321c5042ba05cbd1fae57b1822ecc7be842762e2953aadc434638bd0bf4c642750d9228085bd4bbeac8981a45c4c8675b984a2ff925f9b561d57b37b0fe23695c455f3a2ed089aabdf2e9cbcd0543bb6d33c9ea444e23d8cc946e589426eed35f6a3376099ce55e05131f40ad79991cea79423bfe3a120f5bb7ef739a667326b43403acbd6621d99b7c6abc0450fc45600f437430573f274ee27bf86dd72f64327c95f7d6c108dc7fa785a81bcded1347f29a90c54cd17960175efec90ca0b13dd93951622d480474f5315e47ccdba6708af3d56552ee8c670e7fe4de6dac8f22c151deb414674db1128426ef342de00ecba977db3d642168e4811f6bd3025b755c798677ddea3bef4bd728b5d94e49f9243e797c7f1e6beb910d2ee369c4aae98faab6d8e5348fe1584110f2709d0cac2602dc12229cf95aabb2f940d68b0746c1115b47948ce44e0596e0f405dd8e39f3b24b6101347dab553aeccb77092733065a8346667566677281a311352427c52f50ea7a82eb9ee9fc3c52196813e71af0644fcbea95c4bc0210e20fffd5a7c2ce9babacdf8afb771b418b79c75d7bc76b86cc7972c748218197107655fe06e86346628506d992d769401e03bcc9e4d7772fe14ce9c056fa505bc14b55932b93e26927c054fa14d0514c77e838a3a8942afae5656da6062c46e6f2487fc58675646d540a0cb839de6a4d4cbe1f19d663637fb56c10061ec8615aa6f7eaf28f5e719f78813772dadcf74a8db770e57f08c11e74be5ef9da4d7df54d2a075279fb401dc94d94ebdf78ae60deaa30df7a3552ebc1b94c36606132e119931c04fa49f70ca886987920e062232c4d74d8625d56171f902f7fb90faff02e921525b5dbc87afc92b6566620c41fb9b0f6700285cc2f83311c59ee5a3089630307e2df0c8c55ec8cf5c5c4bf6076a0431043727636ac70c317f9a75150df3147516c6909290f04c0f2c3fa5c701c3a19a2f0a819990ae8bf608b2abf4cda5cafbc394d58509d80b4e9688bf33ed285211b97447ed7b5523ad5e1a41aa16080042082bdee8c82c14e16aab34c72df682fcb2690d9ea56c84f2cd6bae289aab593433a4b2612002d174ebd80c3a728f72b86824c915911a3ae06d33f51bee86e31c6a4296afb4f5f3ef55981010cfaaac95713cdd742ebe47f8d6143bb1d16f83ab57bfff3640426f6c82464ed80581ac6faa4f3cfea53fb3fd139ebb91a0f87ac195e89a28b79a6426e5e7fbce60094f3ee3798adf14b817eb147dffd3baa1a7c260c85e5f340d5e7bd202d43f8747cab65402ebf469204954501c01d6091dc55d78c538af5372');
        test.done();
    },
};
