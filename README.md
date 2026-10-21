# Chalchitra – Movie Website

## Vercel par deploy (GitHub ke saath)
1. Is folder ko GitHub repo mein push karo.
2. vercel.com par login karo, "Add New Project" dabao, repo chuno.
3. Framework: "Other". Koi build command nahi chahiye. "Deploy" dabao.

## Vercel CLI se
    npm i -g vercel
    cd movie-site
    vercel --prod

## Movie kaise add karein
`data/movies.json` kholo aur ek naya object jodo:

    {
      "id": 5,
      "title": "Movie ka naam",
      "year": 2024,
      "genre": "Drama",
      "description": "Chhoti si kahani",
      "poster": "https://.../poster.jpg",
      "video_url": "https://your-cdn.com/movie.mp4"
    }

YouTube video ke liye `video_url` ki jagah `"youtube": "VIDEO_ID"` likho.
Save karke dobara deploy karo (GitHub se connect hai to push karte hi auto-deploy hoga).

## Video file kahan rakhein
Vercel par badi video files mat daalo. Cloudflare R2, Backblaze B2 ya Bunny Stream
par upload karo aur uska link `video_url` mein daalo.
Sirf wahi movies daalo jinke rights tumhare paas hain.
