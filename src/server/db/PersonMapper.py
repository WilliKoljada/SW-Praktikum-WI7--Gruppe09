from server.bo.Person import Person
from server.db.Mapper import Mapper


class PersonMapper(Mapper):
    """Mapper-Klasse, die Konversation-Objekte auf eine relationale
    Datenbank abbildet. Hierzu wird eine Reihe von Methoden zur Verfügung
    gestellt, mit deren Hilfe z.B. Objekte gesucht, erzeugt, modifiziert und
    gelöscht werden können.
    """

    def __init__(self):
        super().__init__()

    def find_all(self):
        """Auslesen aller Person.
        :return Eine Sammlung mit Person-Objekten, die sämtliche Person repräsentieren.
        """
        result = []
        cursor = self._cnx.cursor()
        cursor.execute("SELECT * from person")
        tuples = cursor.fetchall()

        for (id, vorname, nachname, Email, Benutzername, creation_date, google_id) in tuples:
            person = Person()
            person.set_id(id)
            person.set_vorname(vorname)
            person.set_nachname(nachname)
            person.set_email(Email)
            person.set_is_benutzername(Benutzername)
            person.set_creation_date(creation_date)
            person.set_google_user_id(google_id)
            result.append(person)

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_key(self, id):
        """Suchen eines Benutzers mit vorgegebener Person ID. Da diese eindeutig ist,
        wird genau ein Objekt zurückgegeben.
        :param id Primärschlüsselattribut (->DB)
        :return Personen-Objekt, das dem übergebenen Schlüssel entspricht, None bei
            nicht vorhandenem DB-Tupel.
        """

        cursor = self._cnx.cursor()
        command = "SELECT id, vorname, nachname, Email, Benutzername, creation_date, google_id FROM person WHERE id={}".\
            format(id)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (id, vorname, nachname, Email, Benutzername, creation_date, google_id) = tuples[0]
            person = Person()
            person.set_id(id)
            person.set_vorname(vorname)
            person.set_nachname(nachname)
            person.set_email(Email)
            person.set_is_benutzername(Benutzername)
            person.set_creation_date(creation_date)
            person.set_google_user_id(google_id)

        except IndexError:
            """Der IndexError wird oben beim Zugriff auf tuples[0] auftreten, wenn der vorherige SELECT-Aufruf
            keine Tupel liefert, sondern tuples = cursor.fetchall() eine leere Sequenz zurück gibt."""
            person = None

        self._cnx.commit()
        cursor.close()

        return person

    def find_by_google_user_id(self, google_user_id):
        """Suchen eines Benutzers mit vorgegebener Google ID. Da diese eindeutig ist,
        wird genau ein Objekt zurückgegeben.

        :param google_user_id die Google ID des gesuchten Users.
        :return User-Objekt, das die übergebene Google ID besitzt,
            None bei nicht vorhandenem DB-Tupel.
        """
        result = None

        cursor = self._cnx.cursor()
        command = "SELECT id, vorname, nachname, Email, Benutzername, creation_date, google_id FROM person WHERE id=\
        '{}".format(google_user_id)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (id, vorname, nachname, Email, Benutzername, creation_date, google_id) = tuples[0]
            u = Person()
            u.set_id(id)
            u.set_vorname(vorname)
            u.set_nachname(nachname)
            u.set_email(Email)
            u.set_is_benutzername(Benutzername)
            u.set_creation_date(creation_date)
            u.set_google_user_id(google_id)
            result = u
        except IndexError:
            """Der IndexError wird oben beim Zugriff auf tuples[0] auftreten, wenn der vorherige SELECT-Aufruf
            keine Tupel liefert, sondern tuples = cursor.fetchall() eine leere Sequenz zurück gibt."""
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_email(self, email):
        """Auslesen aller Benutzer anhand der zugeordneten E-Mail-Adresse.
        :param mail_address E-Mail-Adresse der zugehörigen Benutzer.
        :return Eine Sammlung mit Personen-Objekten, die sämtliche Benutzer
            mit der gewünschten E-Mail-Adresse enthält.
        """

        cursor = self._cnx.cursor()
        command = "SELECT id, vorname, nachname, Benutzername, creation_date, google_id, \
         FROM person WHERE Email={}".format(email)

        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (id, vorname, nachname, Email, Benutzername, creation_date, google_id) = tuples[0]
            person = Person()
            person.set_id(id)
            person.set_vorname(vorname)
            person.set_nachname(nachname)
            person.set_email(Email)
            person.set_is_benutzername(Benutzername)
            person.set_creation_date(creation_date)
            person.set_google_user_id(google_id)

            result = person

        except IndexError:
            """Der IndexError wird oben beim Zugriff auf tuples[0] auftreten, wenn der vorherige SELECT-Aufruf
            keine Tupel liefert, sondern tuples = cursor.fetchall() eine leere Sequenz zurück gibt."""
            result = None

        self._cnx.commit()
        cursor.close()

        return result

    def insert(self, person):
        """Einfügen eines Person-Objekts in die Datenbank.
        Dabei wird auch der Primärschlüssel des übergebenen Objekts geprüft und ggf.
        berichtigt.
        :param person das zu speichernde Objekt
        :return das bereits übergebene Objekt, jedoch mit ggf. korrigierter ID.
        """
        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(id) AS maxid FROM person ")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            if maxid[0] is None:
                """Wenn wir KEINE maximale ID feststellen konnten, dann gehen wir
                davon aus, dass die ChatInvitation-Tabelle leer ist und wir mit der ID 1 beginnen können."""

                person.set_id(1)

            else:
                """Wenn wir eine maximale ID festellen konnten, zählen wir diese
                um 1 hoch und weisen diesen Wert als ID dem ChatInvitation-Objekt zu."""

                person.set_id(maxid[0] + 1)

        command = "INSERT INTO person (id, vorname, nachname, Email, Benutzername, creation_date, google_id) \
        VALUES (%s,%s,%s,%s,%s,%s,%s)"
        data = (person.get_id(), person.get_vorname(), person.get_nachname(),
        person.get_email(), person.get_benutzername(), person.get_creation_date(), person.get_google_user_id())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()
        return person

    def update(self, person):
        """Wiederholtes Schreiben eines Objekts in die Datenbank.
        :param Person das Objekt, das in die DB geschrieben werden soll
        """

        cursor = self._cnx.cursor()
        command = "UPDATE person SET vorname = ('{}'), nachname = ('{}'), Email = ('{}')," \
                      " Benutzername = ('{}'), creation_date = ('{}'), google_id = ('{}') WHERE id = ('{}')" \
                .format(person.get_vorname(),
                        person.get_nachname(),
                        person.get_email(),
                        person.get_benutzername(),
                        person.get_creation_date(),
                        person.get_google_user_id(),
                        person.get_id()
                        )
        cursor.execute(command)

        self._cnx.commit()
        cursor.close()

    def delete(self, person):
        """Löschen der Daten eines Projekt-Objekts aus der Datenbank.
        :param Person das aus der DB zu löschende "Objekt"
        """
        cursor = self._cnx.cursor()

        command = "DELETE FROM person WHERE id={}".format(person.get_id())
        cursor.execute(command)

        self._cnx.commit()
        cursor.close()

        return person


    # Zum Testen ausführen
if (__name__ == "__main__"):
    with PersonMapper() as mapper:
            person = Person()
            person.set_vorname('')
            person.set_nachname('')
            person.set_is_benutzername('')


            mapper.insert(person)
