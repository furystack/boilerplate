import { Shade, createComponent } from '@furystack/shades'
import { PageContainer, PageHeader, Typography } from '@furystack/shades-common-components'
import { SessionService } from '../services/session.js'

export const HelloWorld = Shade({
  shadowDomName: 'hello-world',
  render: ({ useObservable, injector }) => {
    const [currentUser] = useObservable('userName', injector.getInstance(SessionService).currentUser)
    return (
      <PageContainer maxWidth="800px" centered>
        <PageHeader
          icon="👋"
          title={`Hello, ${currentUser?.username || 'unknown'}!`}
          description="Welcome to the FuryStack Boilerplate application."
        />

        <Typography variant="h5" gutterBottom>
          Egyesült Államok
        </Typography>
        <Typography variant="body1" color="textSecondary">
          A nagy múltú szórakoztató- és divatmagazin, a Cosmopolitan egyik 1967-es száma lelkes hangvételű, bíztató
          cikket közölt arról, milyen nagy jövő vár a nőkre a programozás területén. A cikk további érdekessége, hogy
          benne épp Grace Hoppert – a számítástechnika területén lenyűgöző újdonságokat megalkotó programozónőt –
          idézik, aki szerint: „Programozni olyan, mint megtervezni egy vacsorát […] előre kell tervezni és időzíteni,
          így minden készen lesz, amikor szükség van rá.
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Bár ennek a kijelentésnek feltételezhetően az a célja, hogy a programozói pályára bátorítsa a nőket,
          valószínűleg nem segít abban, hogy kevésbé sztereotipikusan, komplex és értékes feladatként tekintsenek a
          programozásra.
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Nehéz pontos statisztikát találnunk arról, mennyi női és férfi programozó volt az egyes évtizedekben, hiszen
          az, hogy hányan végeztek számítástechnikai szakokon, még nem mutatja meg, mennyien dolgoztak utána a
          területen. Fordítva is igaz ez, nem feltétlenül az egyetemi képzésekről kikerülők végezték mindig a
          programozói feladatokat, ahogy napjainkban sem.
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Az 1980-as évek első felében az Egyesült Államokban az informatikai diplomával rendelkezők 37%-a volt nő,
          összességében a munkavállalók között pedig még többségben voltak ezen a területen. Ezután következett a
          fordulópont, a nők részvétele a számítástechnikai felsőoktatásban és a munkaerőpiacon a következő évtizedekben
          drasztikusan csökkent. A 2010-es években a hallgatók kb. 20%-a volt nő, és az IT szektor munkavállalóira is
          hasonló arány jellemző.
        </Typography>

        <Typography variant="h5" gutterBottom>
          Európa
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Az európai munkaerőpiac helyzetéről, foglalkoztatottsági arányokról, a különböző területeken dolgozók számának
          változásáról az Eurostat készít részletes felmérést. Alapos kutatásaik eredményei számos érdekességgel
          szolgálnak, nem csak a nemek arányára vonatkozóan.
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Az Eurostat vizsgálata nem kifejezetten a programozói szakmára irányul, hanem a programozást magába foglaló
          területet, az infokommunikációt (IKT, angol rövidítése ICT) veszik górcső alá. Európában az IKT területen
          egyértelműen a férfiak dominálnak, a munkavállalók 83,5%-át teszik ki.
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Bár a nők száma nőtt a területen (1.071.500-ról 1.231.700-ra), arányuk mégis csökkent az elmúlt 10 évben,
          hiszen maga a terület olyan dinamikusan növekszik, hogy az arányok megváltoztatásához ez a létszámgyarapodás
          nem elég. 2008-ban az IKT területen dolgozók 22%-a volt nő, 2018-ra ez az arány 16,5%-ra csökkent az EU-ban.
        </Typography>
        <Typography variant="body1" color="textSecondary">
          A 2008-as adatok még több országban kiegyenlítettebb viszonyokat mutatnak a maiaknál. Lehetséges, hogy a
          szovjet éra utóhatását tükrözik ezek a számok, például Bulgáriában, Észtországban, Litvániában, Magyarországon
          és Romániában is kiegyenlítettebb volt a nemek aránya (65% férfi, 35% nő). A volt szovjet hatalmi blokk
          országaiban jellemző volt, hogy a hagyományos nemi szerepektől eltérő munkakörökben is képviseltetik magukat a
          nők (gondolhatunk a traktorista lányok toborzására például). Ebben a blogbejegyzésben a szerző arról ír, hogy
          amikor az édesanyja tanult programozni, (az 1970-es években, a Szovjetunióban) az osztály 100%-ban nőkből
          állt, illetve, hogy a programozás nem maszkulin munkának számított. A BBC oldalán található cikkben szintén
          olvashatunk arról, hogyan vonták be a gazdasági prioritásnak számító technológiai fejlődésbe a nőket is és
          hogyan tették számukra is egyformán elérhetővé a képzést mérnöki, programozói, matematikai területen.
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Mára ezekben az országokban is az európai átlaghoz közelebbi arányok jellemzők. A női IKT szakemberek aránya
          2019-ben Bulgáriában a legmagasabb (28%) és Magyarországon a legalacsonyabb (10,6%) az Európai Unióban.
        </Typography>
      </PageContainer>
    )
  },
})
