function getData(url, fn) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        fn(undefined, JSON.parse(xhr.responseText));
      } else {
        fn(new Error(xhr.statusText), undefined);
      }
    }
  };
  xhr.open("GET", url, true);
  xhr.send();
}

let inPut = document.querySelector("#inPut-seach");
let suggestionsPanel = document.querySelector(".suggestions");

inPut.addEventListener("keyup", function () {
  console.log(inPut.value);
  if (inPut.value == "") {
    suggestionsPanel.innerHTML = "";
  } else {
    suggestionsPanel.innerHTML = "";
    getData(
      `https://en.wikipedia.org/w/api.php?origin=*&action=opensearch&limit=10&format=json&search=${inPut.value}`,
      (err, res) => {
        if (err) {
          console.log(err);
        } else {
          console.log(res);
          let suggestions = res[1].filter(function (country) {
            return country.toLowerCase().startsWith(inPut.value);
          });

          suggestions.forEach(function (suggested) {
            getData(
              `https://en.wikipedia.org/w/api.php?origin=*&action=query&prop=pageprops|pageimages&format=json&titles=${suggested}`,

              (err, res) => {
                if (err) {
                  console.log(err);
                } else {
                  console.log(res);
                  let thumnail = Object.keys(res.query.pages);
                  let imageSource = res.query.pages[thumnail].thumbnail.source;
                  let des =
                    res.query.pages[thumnail].pageprops["wikibase-shortdesc"];

                  const div = document.createElement(`div`);
                  div.innerHTML += `<div class="box-1">
<img src="${imageSource}"
    alt="" class="images1">
<div class="title1">
    <h4>${suggested}</h4>
    <div class="title2"><a style="text-decoration:none;" href="https://en.wikipedia.org/wiki/${suggested}" >${des}</a></div>
</div>
</div>`;
                  suggestionsPanel.appendChild(div);
                }
              }
            );
            // resultSearch.appendChild(div);
          });
        }
      }
    );
  }
});
