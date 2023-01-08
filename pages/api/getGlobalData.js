import answers from "../../public/data/form_answers.json";

/**
 * @param {import('next).NextApiRequest} req
 * @param {import('next).NextApiResponse} res
 */

export default async function handler(req, res) {
  try {
    let savedAnswers = await answers.map(async (item, i) => {
      let new_answer;
      let pais = item.pais || "";
      //console.log("País:", pais);
      pais = pais.trim().replace(" ", "%20");
      try {
        let country_coordinates = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${pais}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`
        )
          .then((response) => response.json())
          .then(async (data) => {
            //console.log("Response 1:", data);
            let data_fetched = await data;

            let cidade =
              item.cidade_vila_aldeia !== undefined
                ? item.cidade_vila_aldeia
                : item.concelho !== undefined
                ? item.concelho
                : item.distrito_estado;
            //console.log("Cidade:", cidade);
            cidade = cidade.trim().replace(" ", "%20");
            //console.log("Center", i, cidade, data_fetched.features[0].center);
            /* console.log(
              "URL:",
              `https://api.mapbox.com/geocoding/v5/mapbox.places/${cidade}.json?proximity=${data.features[0].center[1]},${data.features[0].center[0]}&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`
            ); */
            try {
              let city_coordinates = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${cidade}.json?proximity=${data.features[0].center[1]},${data.features[0].center[0]}&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`
              )
                .then((response) => response.json())
                .then((data) => {
                  //console.log("Response 2:", data);

                  new_answer = {
                    ...item,
                    lat: data.features[0].center[0],
                    lng: data.features[0].center[1],
                  };

                  /* console.log(
                      "New Answer 1:",
                      i,
                      new_answer.lat,
                      new_answer.lng
                    ); */
                });
            } catch (err) {
              //console.log("Err:", i, err);
            }
          });
      } catch (error) {
        //console.log("Error:", i, error);
      }
      //console.log("New Answer 2:", new_answer);
      return new_answer;
    });
    //console.log("New Answer 3:", answers_with_coordinates);
    //savedAnswers = answers_with_coordinates;
    console.log("Server Answers:", savedAnswers);
    res.status(200).json({ answers: savedAnswers });
  } catch (err) {
    console.log("Error Fetching form answers:", err);
    res.status(404).json({ error: err });
  }
}
