import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const IslamicContentPanel = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [islamicDate, setIslamicDate] = useState('15 Rabi\' al-Awwal 1446');
  const [dailyVerse, setDailyVerse] = useState(null);
  const [featuredHadith, setFeaturedHadith] = useState(null);
  const [loadingVerse, setLoadingVerse] = useState(true);
  const [loadingHadith, setLoadingHadith] = useState(true);

  const islamicEvents = [
    {
      id: 1,
      name: "Laylat al-Qadr",
      date: "Expected in last 10 nights of Ramadan",
      type: "special_night",
      description: "The Night of Power, better than a thousand months"
    },
    {
      id: 2,
      name: "Jumu\'ah Prayer",
      date: "Every Friday",
      type: "weekly",
      description: "Congregational Friday prayer"
    },
    {
      id: 3,
      name: "Day of Arafah",
      date: "9th Dhul Hijjah",
      type: "hajj",
      description: "Most important day of Hajj pilgrimage"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 60000);

    const fetchRandomVerse = async () => {
      setLoadingVerse(true);
      try {
        const verseNumber = Math.floor(Math.random() * 6236) + 1;
        const response = await axios.get(`http://api.alquran.cloud/v1/ayah/${verseNumber}/editions/quran-uthmani,en.asad`);
        const verseData = response.data.data;
        setDailyVerse({
          arabic: verseData[0].text,
          translation: verseData[1].text,
          reference: `Quran ${verseData[1].surah.englishName} ${verseData[1].surah.number}:${verseData[1].numberInSurah}`,
        });
      } catch (error) {
        console.error("Error fetching random verse:", error);
      } finally {
        setLoadingVerse(false);
      }
    };

    const fetchRandomHadith = async () => {
      setLoadingHadith(true);
      try {
        const apiKey = import.meta.env.VITE_HADITH_API_KEY;
        const booksResponse = await axios.get(`https://hadithapi.com/api/books?apiKey=${apiKey}`);
        const books = booksResponse.data.books;
        const randomBook = books[Math.floor(Math.random() * books.length)];

        const chaptersResponse = await axios.get(`https://hadithapi.com/api/chapters/${randomBook.bookSlug}?apiKey=${apiKey}`);
        const chapters = chaptersResponse.data.chapters;
        const randomChapter = chapters[Math.floor(Math.random() * chapters.length)];

        const hadithsResponse = await axios.get(`https://hadithapi.com/api/hadiths?apiKey=${apiKey}&book=${randomBook.bookSlug}&chapter=${randomChapter.chapterNumber}`);
        const hadiths = hadithsResponse.data.hadiths;
        const randomHadith = hadiths[Math.floor(Math.random() * hadiths.length)];

        setFeaturedHadith({
          text: randomHadith.hadithEnglish,
          narrator: randomHadith.englishNarrator,
          reference: `${randomBook.bookName}, Hadith ${randomHadith.hadithNumber}`
        });
      } catch (error) {
        console.error("Error fetching random hadith:", error);
      } finally {
        setLoadingHadith(false);
      }
    };

    fetchRandomVerse();
    fetchRandomHadith();

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    return date?.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Islamic Calendar */}
      <div className="bg-card rounded-xl p-6 shadow-islamic-moderate border border-border">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Icon name="Calendar" size={20} className="text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">Islamic Calendar</h3>
            <p className="font-caption text-sm text-muted-foreground">Today's Date</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
            <p className="font-data text-lg text-foreground">{formatDate(currentDate)}</p>
            <p className="font-heading text-sm text-primary mt-1">{islamicDate}</p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-foreground">Upcoming Events</h4>
            {islamicEvents?.slice(0, 2)?.map((event) => (
              <div key={event?.id} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
                <div className="w-2 h-2 bg-secondary rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{event?.name}</p>
                  <p className="text-xs text-muted-foreground">{event?.date}</p>
                  <p className="text-xs text-muted-foreground mt-1">{event?.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Daily Verse */}
      <div className="bg-card rounded-xl p-6 shadow-islamic-moderate border border-border">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
            <Icon name="BookOpen" size={20} className="text-accent-foreground" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">Daily Verse</h3>
            <p className="font-caption text-sm text-muted-foreground">Qur'an Reflection</p>
          </div>
        </div>
        <div className="space-y-4">
          {loadingVerse ? (
            <div className="text-center py-4"><p className="text-sm text-muted-foreground">Fetching verse...</p></div>
          ) : dailyVerse ? (
            <>
              <div className="p-4 bg-accent/5 rounded-lg border border-accent/10">
                <p className="font-heading text-lg text-right text-foreground mb-2" dir="rtl">{dailyVerse.arabic}</p>
                <p className="text-sm text-foreground mb-2">"{dailyVerse.translation}"</p>
                <p className="text-xs text-primary font-medium">{dailyVerse.reference}</p>
              </div>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" iconName="Share" iconPosition="left">Share</Button>
                <Button variant="ghost" size="sm" iconName="Bookmark" iconPosition="left">Save</Button>
              </div>
            </>
          ) : (
            <div className="text-center py-4"><p className="text-sm text-muted-foreground">Could not load verse.</p></div>
          )}
        </div>
      </div>
      {/* Featured Hadith */}
      <div className="bg-card rounded-xl p-6 shadow-islamic-moderate border border-border">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
            <Icon name="Scroll" size={20} className="text-secondary-foreground" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">Featured Hadith</h3>
            <p className="font-caption text-sm text-muted-foreground">Prophetic Guidance</p>
          </div>
        </div>
        <div className="space-y-4">
          {loadingHadith ? (
            <div className="text-center py-4"><p className="text-sm text-muted-foreground">Fetching hadith...</p></div>
          ) : featuredHadith ? (
            <div className="p-4 bg-secondary/5 rounded-lg border border-secondary/10">
              <p className="text-sm text-foreground mb-2">"{featuredHadith.text}"</p>
              <div className="flex items-center justify-between">
                <p className="text-xs text-secondary font-medium">{featuredHadith.reference}</p>
                <p className="text-xs text-muted-foreground">Narrated by {featuredHadith.narrator}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-4"><p className="text-sm text-muted-foreground">Could not load hadith.</p></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IslamicContentPanel;