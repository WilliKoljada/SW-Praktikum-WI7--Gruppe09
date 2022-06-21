from server.bo.Person import Person
from server.db.Mapper import Mapper
from datetime import datetime


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
        cursor.execute("SELECT id, creation_date, vorname, nachname, email, benutzername, role, google_id from person")
        tuples = cursor.fetchall()

        for (id, creation_date, vorname, nachname, Email, Benutzername, role, google_id) in tuples:
            person = Person()
            person.set_id(id)
            person.set_creation_date(creation_date)
            person.set_vorname(vorname)
            person.set_nachname(nachname)
            person.set_email(Email)
            person.set_benutzername(Benutzername)
            person.set_google_id(google_id)
            person.set_role(role)
            result.append(person)

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_key(self, key):
        """Suchen eines Benutzers mit vorgegebener Person ID. Da diese eindeutig ist,
        wird genau ein Objekt zurückgegeben.
        :param id Primärschlüsselattribut (->DB)
        :return Personen-Objekt, das dem übergebenen Schlüssel entspricht, None bei
            nicht vorhandenem DB-Tupel.
        """

        cursor = self._cnx.cursor()
        command = "SELECT id, creation_date, vorname, nachname, email, benutzername, role, google_id FROM person WHERE id={}".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (id, creation_date, vorname, nachname, email, benutzername, role, google_id) in tuples:
            person = Person()
            person.set_id(id)
            person.set_creation_date(creation_date)
            person.set_vorname(vorname)
            person.set_nachname(nachname)
            person.set_email(email)
            person.set_benutzername(benutzername)
            person.set_role(role)
            person.set_google_id(google_id)

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
        command = "SELECT id, creation_date, vorname, nachname, email, benutzername, role, google_id FROM person WHERE google_id='{}'".format(google_user_id)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (id, creation_date, vorname, nachname, email, benutzername, role, google_id) = tuples[0]
            u = Person()
            u.set_id(id)
            u.set_creation_date(creation_date)
            u.set_vorname(vorname)
            u.set_nachname(nachname)
            u.set_email(email)
            u.set_benutzername(benutzername)
            u.set_role(role)
            u.set_google_id(google_id)
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
        command = "SELECT id, creation_date, vorname, nachname, email, benutzername, role, google_id, \
         FROM person WHERE email='{}'".format(email)

        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (id, creation_date, vorname, nachname, email, benutzername, role, google_id) = tuples[0]
            person = Person()
            person.set_id(id)
            person.set_creation_date(creation_date)
            person.set_vorname(vorname)
            person.set_nachname(nachname)
            person.set_email(email)
            person.set_benutzername(benutzername)
            person.set_role(role)
            person.set_google_id(google_id)

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

        creation_date = datetime.utcnow()
        command = "INSERT INTO person (id, creation_date, vorname, nachname, email, benutzername, role, google_id) VALUES (%s,%s,%s,%s,%s,%s,%s,%s)"
        data = (person.get_id(), creation_date, person.get_vorname(), person.get_nachname(),
        person.get_email(), person.get_benutzername(), person.get_role(), person.get_google_id())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()
        return person

    def update(self, person):
        """Wiederholtes Schreiben eines Objekts in die Datenbank.
        :param Person das Objekt, das in die DB geschrieben werden soll
        """

        cursor = self._cnx.cursor()
        command = "UPDATE person SET vorname=%s, nachname=%s, email=%s benutzername=%s, role=%s, google_id=%s WHERE id=%s"
        data = (person.get_vorname(), person.get_nachname(), person.get_email(), person.get_benutzername(), person.get_role(), person.get_google_id(), person.get_id())
        cursor.execute(command, data)
        self._cnx.commit()
        cursor.close()

    def delete(self, id):
        """Löschen der Daten eines Projekt-Objekts aus der Datenbank.
        :param Person das aus der DB zu löschende "Objekt"
        """
        cursor = self._cnx.cursor()

        person = self.find_by_key(id)

        command = "DELETE FROM person WHERE id={}".format(id)
        cursor.execute(command)
        self._cnx.commit()
        cursor.close()

        return person


    # Zum Testen ausführen
if __name__ == "__main__":
    with PersonMapper() as mapper:
        person = Person()
        person.set_email(1)
        person.set_creation_date("2022.06.07 00:00:00.0000")
        person.set_vorname("test")
        person.set_nachname("user")
        person.set_email("test@user.de")
        person.set_benutzername("testuser")
        person.set_role("admin")
        person.set_google_id("jdhbkjv-fukjhr-efkjwfb")

        mapper.insert(person)