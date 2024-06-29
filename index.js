
function getBlockTags(tagID) {
    switch (tagID) {
        case "bq": return "blockquote";
        case "script": return "p"; // Helps Sanitize Code
        case "samp": return "div"
        default: return tagID;
    }
}
function getInlineTags(tagID) {
    switch (tagID) {
        default: return tagID;
    }
}

function evaluateInlineText(line, lineType) {
    line = line.replace(/</g, "&lt;");
    line = line.replace(/>/g, "&gt;");
    let text = '';
    // console.log(`Evaluating ${line} for inline elements`);
    const lineSplit = line.split('/');
    let inlineTags = [];
    lineSplit.forEach((value, i)=>{
        if(i===0) text += value; //There can't be anything yet, right?
        else if (i === lineSplit.length - 1) {
            // Close any tags, write final words
            let closedTags = inlineTags.map(
                (inlineTag) => `</${inlineTag}>`
            );
            if (closedTags) text += `${closedTags.join('')}${value}`;
            else text += value;
        }
        else {
            // console.log(value)
            value = value.split('\t');
            if(value.length > 1) {
                // Well then there must be some sort of thing
                value[0].split('|') //Get classes
                let tagID = getInlineTags(value[0][0]);
                inlineTags.push(tagID);
                text += `<${value[0][0]}${value[0][1]?` class='${value[0][1]}'`:``}>${value[1]}`
            }   
            else {
                // Close any open tags
                if(inlineTags.length) {
                    text += `</${inlineTags.pop()}>${value[0]}`;
                    
                }
                else text += `${value[0]}`
            }
        }
    });
    // console.log('And the text is', text);
    return text;
}
function evalulate(biu) {
  let currentBlockTag = ""; // P, H1, ect.
  let text = ""; // HTML
  // Separate each line
  let lineSep = /[\n\r]+/g;
  let linesBIU = biu.split(lineSep);
  //Now, each line is separate. The next task: find tab number one and separate
  linesBIU = linesBIU.map((line) => {
    line = line.split("\t");
    line = [line.shift(), line.join("\t")]; // Line is now [lineType, text]
    if (line[0].length) {
      // Changing tags...
      if (currentBlockTag.length) text += `</${currentBlockTag}>`;
      currentBlockTag = getBlockTags(line[0]);
      text += `<${currentBlockTag}>`;
    }
    // Now we go!
    text += evaluateInlineText(line[1], line[0]);
    return line;
  });
  if (currentBlockTag.length) text += `</${currentBlockTag}>`;
  // Log content as link
  const encodedHtmlContent = encodeURIComponent(text);
  console.log(`data:text/html;charset=utf-8,${encodedHtmlContent}`);
  return text;
}
module.exports = evalulate;
