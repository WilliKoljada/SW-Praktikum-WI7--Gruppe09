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

        for (id, vorname, nachname, email, creation_time, benutzername) in tuples:
            person = Person()
            person.set_id(id)
            person.set_vorname(vorname)
            person.set_nachname(nachname)
            person.set_creation_time(creation_time)
            person.set_benutzername(benutzername)
            result.append(person)

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_key(self, key):
        """Auslesen aller Person aet anhand der ID,
        da diese vorgegeben ist, wird genau ein Objekt zurückgegeben.
        :param key Primärschlüsselattribut
        :return Person-Objekt, das dem übergebenen Schlüssel entspricht, None bei
        nicht vorhandenem DB-Tupel
        """
        result = None

        cursor = self._cnx.cursor()
        command = "SELECT * FROM person WHERE id={}".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()
        for (id, vorname, nachname, email, creation_time, benutzername) in tuples:
            person = Person()
            person.set_id(id)
            person.set_vorname(vorname)
            person.set_nachname(nachname)
            person.set_creation_time(creation_time)
            person.set_benutzername(benutzername)

        result = person

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
            if maxid[0] is not None:
                """Wenn wir eine maximale ID festellen konnten, zählen wir diese
                um 1 hoch und weisen diesen Wert als ID dem User-Objekt zu."""
                person.set_id(maxid[0] + 1)
            else:
                """Wenn wir keine maximale ID feststellen konnten, dann gehen wir
                davon aus, dass die Tabelle leer ist und wir mit der ID 1 beginnen können."""
                person.set_id(1)

        command = "INSERT INTO person (id, vorname, nachname, email, creation_time, benutzername) VALUES (%s,%s,%s,%s,%s,%s)"
        data = (
        person.get_id(), person.get_creation_time(), person.get_vorname(), person.get_nachname(), person.get_benutzername())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

        return person

    def update(self, person):
        """Wiederholtes Schreiben eines Objekts in die Datenbank.
        :param person das Objekt, das in die DB geschrieben werden soll
        """
        cursor = self._cnx.cursor()

        command = "UPDATE person SET vorname=%s, nachname=%s, email=%s, creation_time=%s, benutzername=%s, WHERE id=%s"
        data = (person.get_vorname(), person.get_nachname(), person.get_email(), person.get_benutzername(), person.get_id())

        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

    def delete(self, person):
        """Löschen der Daten eines Projekt-Objekts aus der Datenbank.
        :param person das aus der DB zu löschende "Objekt"
        """
        cursor = self._cnx.cursor()

        command = "DELETE FROM person WHERE id={}".format(person.get_id())
        cursor.execute(command)

        self._cnx.commit()
        cursor.close()

        return person



    def find_by_id(self, id):

        result = []
        cursor = self._cnx.cursor()
        command = "SELECT id, creation_time, bezeichnung, kapazitaet_in_personentagen FROM person WHERE id={}".format(id)

        cursor.execute(command)
        tuples = cursor.fetchall()

        for (id, vorname, nachname, email, creation_time, benutzername) in tuples:
            person = Person()
            person.set_id(id)
            person.set_vorname(vorname)
            person.set_nachname(nachname)
            person.set_creation_time(creation_time)
            person.set_benutzername(benutzername)
            result.append(person)

        self._cnx.commit()
        cursor.close()

        return result

    # Zum Testen ausführen
    if (__name__ == "__main__"):
        with PersonMapper() as mapper:
            person = Person()
            person.set_name("Person")
            person.set_id(2)

            mapper.insert(person)