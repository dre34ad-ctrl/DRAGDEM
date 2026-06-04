
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ARTICLES, getArticleBySlug } from "@/lib/editorial/articles";
import Navbar from "@/components/Navbar";
import { SpotlightHero } from "@/components/spotlight/SpotlightHero";
import { NarrativeFlow } from "@/components/spotlight/NarrativeFlow";
import { VaultHighlight } from "@/components/spotlight/VaultHighlight";
import { SnapConclusion } from "@/components/spotlight/SnapConclusion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export async function generateStaticParams() {
  return ARTICLES.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ locale: string; slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) return { title: "Article Not Found" };

  return {
    title: `${article.title} | The Pulse | DRAGDEM`,
    description: article.excerpt,
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) notFound();

  return (
    <main className="min-h-screen bg-black pb-20">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-8">
        <Link 
          href={`/${locale}/pulse`}
          className="inline-flex items-center text-gray-500 hover:text-cyan-400 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Back to The Pulse</span>
        </Link>

        {article.category === "Spotlight" ? (
          <div className="space-y-16">
            <SpotlightHero 
              title={article.title}
              subtitle={article.excerpt}
              imageUrl={article.imageUrl}
            />
            
            <NarrativeFlow 
              content={article.content}
            />

            {article.performerVanity && (
              <VaultHighlight 
                performerName={article.title.split(': ')[1] || article.title}
                vanityUrl={article.performerVanity}
              />
            )}

            <SnapConclusion 
              articleId={article.id}
              performerName={article.title.split(': ')[1] || article.title}
            />
          </div>
        ) : (
          <article className="max-w-4xl mx-auto">
             <div className="mb-12">
               <span className="text-cyan-400 text-[10px] font-black uppercase tracking-widest block mb-4">
                 {article.category} • {article.region}
               </span>
               <h1 className="text-4xl md:text-6xl font-serif italic text-white mb-6 leading-tight">
                 {article.title}
               </h1>
               <p className="text-xl text-gray-400 font-light leading-relaxed">
                 {article.excerpt}
               </p>
             </div>

             <div 
               className="aspect-video rounded-3xl overflow-hidden mb-16 grayscale hover:grayscale-0 transition-all duration-700"
               style={{ backgroundImage: `url(${article.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
             />

             <div className="prose prose-invert prose-cyan max-w-none">
                <div dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br/>') }} className="text-gray-300 leading-relaxed space-y-6" />
             </div>

             <div className="mt-20 p-8 rounded-3xl bg-gradient-to-br from-yellow-600/10 to-transparent border border-yellow-600/20">
                <h3 className="text-xl font-black uppercase tracking-widest text-yellow-500 mb-4">Ready to level up?</h3>
                <p className="text-gray-400 mb-8">
                  Professionalism is your ultimate act. Update your regional settings and get verified today.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link 
                    href={`/${locale}/settings`}
                    className="px-8 py-4 bg-yellow-600 text-black font-black uppercase tracking-widest text-xs rounded-full hover:bg-yellow-500 transition-colors"
                  >
                    Update My Settings
                  </Link>
                  <Link 
                    href={`/${locale}/dashboard`}
                    className="px-8 py-4 bg-white/5 text-white border border-white/10 font-black uppercase tracking-widest text-xs rounded-full hover:bg-white/10 transition-colors"
                  >
                    View Dashboard
                  </Link>
                </div>
             </div>
          </article>
        )}
      </div>
    </main>
  );
}
