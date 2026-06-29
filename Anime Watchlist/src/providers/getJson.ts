export function toIdentity(input: any) {
    return {
        data: {
            dynamic: [
                { type: 1, name: "anime_watched", value: input.anime_watched },
                { type: 1, name: "nr1_anime", value: input.nr1_anime },
                { type: 3, name: "nr1_anime_img", value: { url: input.nr1_anime_img } },
                { type: 1, name: "nr2_anime", value: input.nr2_anime },
                { type: 3, name: "nr2_anime_img", value: { url: input.nr2_anime_img } },
                { type: 1, name: "nr3_anime", value: input.nr3_anime },
                { type: 3, name: "nr3_anime_img", value: { url: input.nr3_anime_img } }
            ]
        }
    }
}