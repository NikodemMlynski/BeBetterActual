# BeBetter - Aplikacja do samorozwoju

BeBetter to aplikacja pozwalająca na lepsze organizowanie i planowanie dnia, a także na kontrolowanie i sprawdzanie postępów w samorozwoju. Aplikacja oferuje szereg narzędzi, takich jak planowanie nawyków, inteligentny dziennik, ćwiczenia oddechowe, dodawanie celów długoterminowych i wyświetlanie afirmacji wygenerowanych przez AI.

Strona główna wyświetla codziennie wygenerowane porady dotyczące zdrowia, produktywności i planowania dnia. Na stronie głównej można również przeglądać wcześniej dodane nawyki i oznaczać je jako wykonane lub usuwać.

## Wymagania wstępne

Aby uruchomić aplikację BeBetter, potrzebujesz następujących narzędzi:

- Przeglądarka internetowa
- Node.js (zawierający npm)
- mongodb

## Instrukcja instalacji

1. Sklonuj lub pobierz repozytorium.
   ```git clone https://github.com/NikodemMlynski/BeBetterActual ```

3. Przejdź przejdź do katalogu projektu.

5. Zainstaluj wymagane zależności w terminalu (express, mongodb, cors, json) wykonując poniższą komendę:
``` npm install ```

Do poprawnego działania aplikacji wymagane jest również zainstalowanie bazy danych mongodb czyli MongoClient. W MongoClient
trzeba stworzyć baze danych o nazwie `BeBetter` z kolekcją o nazwie `users`
7. Aby dane do bazy danych wysyłały się poprawnie, trzeba zmienić adresy wysyłanych plików na lokalne, wszystkie
   wymagane zmiany są zawarte w folderze /instrukcja instalacji. W każdej funkcji fetch() jako argument należy podać adres: `http://127.0.0.1:8080/NAZWA_ADRESU np. /users`.
8. W pliku backend.js w linijce 7 do stałej `url` trzeba przypisać wartość: `mongodb://localhost:27017`

Po zakończeniu instalacji przenieś się do folderu backend i uruchom aplikację, wpisując:
```cd backend```
```node index.js```
I otwierając "index.html". Najlepiej za pomocą aplikacji Visual Studio Code wybierając opcję live server (trzeba zainstalować wtyczkę liveserwer)

Aplikacja BeBetter zostanie uruchomiona na lokalnym serwerze, pod Twoim adresem lokalnym.

Zamiast instalować aplikację lokalnie możesz również wejść na naszą domenę `hackheroes.mrawsky.fun`

## Zależności
Aplikacja BeBetter korzysta z następujących zależności, które zostaną zainstalowane za pomocą npm:

-cors: ^2.8.5

-crypto: ^1.0.1

-express: ^4.18.2

-mongodb: ^6.1.0

-nodemon: ^3.0.1

A także biblioteki [AOS](https://michalsnik.github.io/aos/)

## Funkcje
Planer nawyków: Pozwala na dodawanie nawyków z tytułem, czasem wykonania i opcjonalnym opisem.

Inteligentny dziennik: Pozwala na dodawanie wpisów z dnia, zawierających ogólny opis dnia, co zostało zrobione dobrze i źle, ilość snu, jakość snu, ilość spożytych kalorii oraz czas poświęcony na wykonywanie nawyków.

Ćwiczenia oddechowe: Oferuje dwa rodzaje ćwiczeń oddechowych: spokojne oddychanie i energetyczne oddychanie.

Dodawanie celów długoterminowych: Pozwala na dodawanie długoterminowych celów, które wyświetlają się na stronie notatek.

Afirmacje: Wyświetla afirmacje wygenerowane z użyciem sztucznej inteligencji.

## Licencja
Ten projekt jest licencjonowany na podstawie Apache License Version 2.0, zdatnej od stycznia 2004 roku.

## Autorzy
Nikodem Młyński Deweloper

Kuba Schreiber Gfx, Dokumentacja

Mikołaj Morawski Deweloper, Gfx, Dokumentacja

Dokładniejsze i lepiej zobrazowane informacje na temat projektu znajdują się w pliku Dokumentacja.pdf
