/**
 * Compact multilingual stopword lists.
 *
 * Coverage: en, es, fr, de, it, pt, nl, ru, zh (function chars), ja (particles), ar.
 * These are intentionally short — only the highest-frequency function words —
 * because aggressive stopword removal hurts BM25 on short chunks more than it helps.
 *
 * Stopwords from individual languages are merged into a single set. Cross-language
 * collisions (e.g. "a", "la") are intentional: removing them is correct in any
 * of the languages they belong to. This sidesteps language detection at query time.
 *
 * Sources (paraphrased, public-domain function-word lists):
 *   - NLTK stopwords (English, German, Spanish, French, Russian)
 *   - spaCy default stop_words for each lang
 *   - Common particles from Stanford CoreNLP Japanese/Chinese tokenizers
 */

const STOPWORDS_BY_LANG = {
  en: ["a","an","and","are","as","at","be","by","for","from","has","have","he","in","is","it","its","of","on","that","the","to","was","were","will","with","i","you","we","they","this","but","or","not","if","do","does","did","so","than","there","their","them","then","these","those","what","which","who","whom","whose","when","where","why","how","all","any","both","each","few","more","most","other","some","such","no","nor","only","own","same","too","very","can","just","should","now","my","your","his","her","ours","yours"],
  es: ["el","la","los","las","de","del","y","o","pero","si","no","un","una","unos","unas","es","son","está","están","fue","ser","muy","más","con","sin","por","para","que","como","cuando","donde","esto","esta","ese","esa","aquel","aquella","mi","tu","su","nuestro","vuestro"],
  fr: ["le","la","les","de","du","des","et","ou","mais","si","ne","pas","un","une","est","sont","être","très","plus","avec","sans","pour","par","que","qui","comme","quand","où","ce","cette","ces","mon","ton","son","notre","votre","leur"],
  de: ["der","die","das","den","dem","des","und","oder","aber","wenn","nicht","ein","eine","einen","einem","einer","ist","sind","sein","sehr","mehr","mit","ohne","für","durch","dass","wie","wann","wo","dies","diese","dieser","mein","dein","sein","unser","euer","ihr"],
  it: ["il","la","lo","i","gli","le","di","del","della","e","o","ma","se","non","un","una","uno","è","sono","essere","molto","più","con","senza","per","da","che","come","quando","dove","questo","questa","questi","queste","quello","quella","mio","tuo","suo","nostro","vostro","loro"],
  pt: ["o","a","os","as","de","do","da","dos","das","e","ou","mas","se","não","um","uma","é","são","ser","muito","mais","com","sem","por","para","que","como","quando","onde","este","esta","esse","essa","aquele","aquela","meu","teu","seu","nosso","vosso"],
  nl: ["de","het","een","en","of","maar","als","niet","is","zijn","was","waren","met","zonder","voor","door","dat","die","dit","deze","mijn","jouw","zijn","onze"],
  ru: ["и","в","во","не","что","он","на","я","с","со","как","а","то","все","она","так","его","но","да","ты","к","у","же","вы","за","бы","по","только","ее","мне","было","вот","от","меня","еще","нет","о","из","ему"],
  zh: ["的","了","和","是","在","我","有","也","就","不","人","都","一","上","他","你","与","这","那","但","因为","所以","如果"],
  ja: ["の","に","は","を","た","が","で","て","と","し","れ","さ","ある","いる","も","する","から","な","こと","として","い","や","れる","など","なっ","ない","この","ため","その","あっ","よう","また","もの","という","あり"],
  ar: ["في","من","إلى","على","عن","مع","هذا","هذه","ذلك","تلك","الذي","التي","الذين","ما","لا","لم","لن","قد","كان","يكون","هو","هي","هم","نحن","أنت","أنتم","أنا"],
};

const STOPWORDS = new Set(Object.values(STOPWORDS_BY_LANG).flat());

module.exports = { STOPWORDS, STOPWORDS_BY_LANG };
