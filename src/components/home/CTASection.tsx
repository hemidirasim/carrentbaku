const CTASection = () => {
  return (
    <section
      className="py-20 relative overflow-hidden"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1501630834273-4b5604d2ee31?q=80&w=1600')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/35" />
      <div className="absolute inset-0" style={{ backgroundColor: '#ffffffb0' }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex justify-center items-center">
          <p className="text-slate-900 font-extrabold leading-relaxed text-lg md:text-xl text-center max-w-4xl">
            Planlarınız havadan asılı deyil. Biz sizi hər şəraitdə yola çıxarırıq.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
