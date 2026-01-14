import Link from 'next/link';

export default function Home() {
  return (
    <main className="container-custom min-h-screen">
      <h1 style={{ textAlign: 'center' }}>ayush.writes</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        {/* Hindi Card */}
        <div className="category-card">
          <div className="category-title">
            <span>✍️</span>
            <span>हिंदी</span>
          </div>
          <p className="category-desc">Poetry and prose in Hindi</p>
          <div className="space-y-1">
            <Link href="/hindi/poetry" className="link-item">
              <span>📄</span> काव्य
            </Link>
            <Link href="/hindi/prose" className="link-item">
              <span>📄</span> गद्य
            </Link>
          </div>
        </div>

        {/* English Card */}
        <div className="category-card blue">
          <div className="category-title">
            <span>📘</span>
            <span>English</span>
          </div>
          <p className="category-desc">Poems and short prose</p>
          <div className="space-y-1">
            <Link href="/english/poems" className="link-item">
              <span>📄</span> Poems
            </Link>
            <Link href="/english/prose" className="link-item">
              <span>📄</span> Prose
            </Link>
          </div>
        </div>

        {/* Blogs Card */}
        <div className="category-card green">
          <div className="category-title">
            <span>📝</span>
            <span>Blogs</span>
          </div>
          <p className="category-desc">Occasional reflections</p>
          <p className="text-sm text-gray-400 mt-2">• Coming soon (hopefully)</p>
        </div>
      </div>

      <div className="intro-section">
        <div className="intro-text space-y-4">
          <p>
            Hello world, I write sometimes. There was a time when I used to write a lot. Almost daily. Then it started to fade away. Now it has gone to a couple of pieces in 6 months. I wish I get more regular. I wish I get to spend more and more time writing. No matter how bad the piece is. Writing is the goal. Writing good can follow later, I hope.
          </p>
          <p>
            Since i have been writing for a significant amount of time, i have a few pieces which i can share with the world (i plan to share only a small subset of my writings here) like every other person out there, i am very hesitant to share any of my pieces. not because i write shit (could be true, idk) but mainly because the pieces are very personal. they have originated from the places of grief, trauma, love, life, etc (just like every other person). but i think i have still not reached that state where i can fully embrace the rawness of them in front of people. but it is a journey which i want to traverse. so here is this blog/ site/ compilation/ journal / experiment or whatever category it fits.
          </p>
          <p>
            currently as i type, i think i will just host it to the free servers. any free application which lets me host my place. i do not plan to share it with a lot of people. it might stay in my social media bios or within a couple of friends for a few years. let's see what happens post that.
          </p>
          <p>
            if you are a stranger reading this (which is unlikely as i don't see it going past my friend circles), a brief background about me - Engineer. Working in IT industry. i like reading, writing. staying aware of what is happening around me socially and politically (regular boring everyday stuff).
          </p>
          <p>
            so here it goes. a lone shout to the universe without any purpose. a space where i can let my words and thoughts float around. for a little bit. until they grow tired of the time.
          </p>
          <p className="font-semibold text-white">Ayush</p>
          <p>29.10.2025</p>
          <p>Contact : ayushdashh@gmail.com</p>
        </div>
      </div>

      <footer>
        © Ayush
      </footer>
    </main>
  );
}
