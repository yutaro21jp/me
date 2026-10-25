interface Project {
  title: string
  description: string
  href?: string
  imgSrc?: string
  ctaLabel?: string
}

const projectsData: Project[] = [
  {
    title: 'Blogstr',
    description: `A Nostr-based blogging app for articles, short posts, tips, and paid content. Share your creative work without tying your content or connections to a single platform.`,
    imgSrc: '/images/blog/20260601/blogstr.webp',
    href: 'https://blogstr.net/read/?naddr=naddr1qvzqqqr4gupzpvsmus40v2jqa02hnz2whx0hkecfsns4f5w062akcx30x7hd59gsqq8ryvpjxccnqvfsxqur2wpsxcnd88k0',
    ctaLabel: 'View project',
  },
  {
    title: 'Translations',
    description: `I translate Bitcoin & Nostr projects into Japanese, from apps and media to educational resources. This page highlights my work and the projects I have supported.`,
    imgSrc: '/images/translations/translations-project.webp',
    href: '/translations',
    ctaLabel: 'View project',
  },
  {
    title: 'ビットコイン本',
    description: `初心者でも楽しく学べるビットコイン小説を通して、難しく見えがちなテーマをやさしく届けています。物語の読みやすさと学びの深さを両立させたいあなたへ。`,
    imgSrc: '/images/blog/20250131/bitcoin-resistance-1st.webp',
    href: '/blog/bitcoin-resistance-1st',
  },
  {
    title: 'ビットコイン連載',
    description: `NADA NEWSのANAP Brand Channelで、世界情勢や経済、社会課題を切り口にビットコインの連載を執筆しています。ビットコインと社会のつながりを知りたいあなたへ。`,
    imgSrc: '/images/blog/20260203/ANAP-NADANEWS-BrandChannel.webp',
    href: '/blog/anap-brand-channel',
  },
  {
    title: 'BTCインサイト',
    description: `基礎から最前線まで ──ビットコインに関する本質的な情報と技術的背景を、毎週わかりやすく解説しています。ノイズに惑わされず、確かな理解を手に入れたいあなたへ。`,
    imgSrc: '/images/btc-insight-project.webp',
    href: '/blog/btc-insight',
  },
  {
    title: 'バイブコーディング',
    description: `バイブコーディングで使っているツールと、実際に制作したサイトをまとめています。AIと対話しながら、アイデアを自分の手で形にしたいあなたへ。`,
    imgSrc: '/images/vibe-coding-project.webp',
    href: '/vibecoding',
  },
]

export default projectsData
