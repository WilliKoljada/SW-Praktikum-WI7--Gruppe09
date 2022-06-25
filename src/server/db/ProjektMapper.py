from server.bo.Projekt import Projekt
from server.db.Mapper import Mapper
from datetime import datetime, timedelta


class ProjektMapper(Mapper):
    """Mapper-Klasse, die Konversation-Objekte auf eine relationale
    Datenbank abbildet. Hierzu wird eine Reihe von Methoden zur Verfügung
    gestellt, mit deren Hilfe z.B. Objekte gesucht, erzeugt, modifiziert und
    gelöscht werden können.
    """

    def __init__(self):
        super().__init__()

    def _rechne_kapaziteat(self, projektID):
        zeiten = []
        cursor = self._cnx.cursor()
        command = "SELECT datum, startzeit, endzeit from zeitintervall WHERE aktivitaetID IN (SELECT id from aktivitaet WHERE projektID={})".format(
            projektID)
        cursor.execute(command)
        zeiten = cursor.fetchall()
        kapaziteat = timedelta(0)
        for (datum, startzeit, endzeit) in zeiten:
            begin_time = datetime.strptime(str(startzeit), "%H:%M:%S").time()
            end_time = datetime.strptime(str(endzeit), "%H:%M:%S").time()
            begin = datetime.combine(datum, begin_time)
            end = datetime.combine(datum, end_time)

            if end > begin:
                kapaziteat += (end - begin)
            else:
                kapaziteat += timedelta(0)

        cursor.close()
        return str(kapaziteat)

    def find_all(self):
        """Auslesen aller Projekt.
        :return Eine Sammlung mit Projekt-Objekten, die sämtliche Projekt repräsentieren.
        """
        result = []
        cursor = self._cnx.cursor()
        cursor.execute("SELECT id, creation_date, name, auftraggeber, beschreibung, personID from projekt")
        tuples = cursor.fetchall()

        for (id, creation_date, name, auftraggeber, beschreibung, personID) in tuples:
            projekt = Projekt()
            projekt.set_id(id)
            projekt.set_creation_date(creation_date)
            projekt.set_name(name)
            projekt.set_auftraggeber(auftraggeber)
            projekt.set_beschreibung(beschreibung)
            projekt.set_personID(personID)
            projekt.set_kapazitaet(self._rechne_kapaziteat(id))
            result.append(projekt)

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_key(self, key):
        """Auslesen aller Projekt anhand der ID,
        da diese vorgegeben ist, wird genau ein Objekt zurückgegeben.
        :param key Primärschlüsselattribut
        :return Projekt-Objekt, das dem übergebenen Schlüssel entspricht, None bei
        nicht vorhandenem DB-Tupel
        """
        result = None

        cursor = self._cnx.cursor()
        command = "SELECT id, creation_date, name, auftraggeber, beschreibung, personID FROM projekt WHERE id={}".format(
            key)
        cursor.execute(command)
        tuples = cursor.fetchall()
        for (id, creation_date, name, auftraggeber, beschreibung, personID) in tuples:
            projekt = Projekt()
            projekt.set_id(id)
            projekt.set_creation_date(creation_date)
            projekt.set_name(name)
            projekt.set_auftraggeber(auftraggeber)
            projekt.set_beschreibung(beschreibung)
            projekt.set_personID(personID)
            projekt.set_kapazitaet(self._rechne_kapaziteat(id))

            result = projekt

        self._cnx.commit()
        cursor.close()
        return result

    def find_by_name(self, name):
        result = []
        cursor = self._cnx.cursor()
        command = "SELECT id, creation_date, name, auftraggeber, beschreibung, personID FROM projekt WHERE name LIKE '{}'".format(
            name)
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (id, creation_date, name, auftraggeber, beschreibung, personID) in tuples:
            projekt = Projekt()
            projekt.set_id(id)
            projekt.set_creation_date(creation_date)
            projekt.set_name(name)
            projekt.set_auftraggeber(auftraggeber)
            projekt.set_beschreibung(beschreibung)
            projekt.set_personID(personID)
            projekt.set_kapazitaet(self._rechne_kapaziteat(id))
            result.append(projekt)

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_personID(self, personID):
        result = []
        cursor = self._cnx.cursor()
        command = "SELECT id, creation_date, name, auftraggeber, beschreibung, personID FROM projekt WHERE personID={}".format(
            personID)
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (id, creation_date, name, auftraggeber, beschreibung, personID) in tuples:
            projekt = Projekt()
            projekt.set_id(id)
            projekt.set_creation_date(creation_date)
            projekt.set_name(name)
            projekt.set_auftraggeber(auftraggeber)
            projekt.set_beschreibung(beschreibung)
            projekt.set_personID(personID)
            projekt.set_kapazitaet(self._rechne_kapaziteat(id))
            result.append(projekt)

        self._cnx.commit()
        cursor.close()

        return result

    def insert(self, projekt):
        """Einfügen eines Projekt-Objekts in die Datenbank.
        Dabei wird auch der Primärschlüssel des übergebenen Objekts geprüft und ggf.
        berichtigt.
        :param projekt das zu speichernde Objekt
        :return das bereits übergebene Objekt, jedoch mit ggf. korrigierter ID.
        """
        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(id) AS maxid FROM projekt ")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            if maxid[0] is not None:
                """Wenn wir eine maximale ID festellen konnten, zählen wir diese
                um 1 hoch und weisen diesen Wert als ID dem User-Objekt zu."""
                projekt.set_id(maxid[0] + 1)
            else:
                """Wenn wir keine maximale ID feststellen konnten, dann gehen wir
                davon aus, dass die Tabelle leer ist und wir mit der ID 1 beginnen können."""
                projekt.set_id(1)

        creation_date = datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S")
        projekt.set_creation_date(creation_date)
        command = "INSERT INTO projekt (id, creation_date, name, auftraggeber, beschreibung, personID) VALUES (%s,%s,%s,%s,%s,%s)"
        data = (
        projekt.get_id(), creation_date, projekt.get_name(), projekt.get_auftraggeber(), projekt.get_beschreibung(),
        projekt.get_personID())

        cursor.execute(command, data)
        self._cnx.commit()
        cursor.close()

        return projekt

    def update(self, projekt):
        """Wiederholtes Schreiben eines Objekts in die Datenbank.
        :param projekt das Objekt, das in die DB geschrieben werden soll
        """
        cursor = self._cnx.cursor()

        command = "UPDATE projekt SET name=%s, auftraggeber=%s, beschreibung=%s, personID=%s WHERE id=%s"
        data = (projekt.get_name(), projekt.get_auftraggeber(), projekt.get_beschreibung(), projekt.get_personID(),
                projekt.get_id())
        print(data)
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

    def delete(self, id):
        """Löschen der Daten eines Projekt-Objekts aus der Datenbank.
        :param projekt das aus der DB zu löschende "Objekt"
        """
        cursor = self._cnx.cursor()
        projekt = self.find_by_key(id)

        command = "DELETE FROM projekt WHERE id={}".format(id)
        cursor.execute(command)

        self._cnx.commit()
        cursor.close()

        return projekt

    # Zum Testen ausführen


if (__name__ == "__main__"):
    with ProjektMapper() as mapper:
        projekt = Projekt()
        projekt.set_name("madrid")
        projekt.set_beschreibung("beschreibung")
        projekt.set_personID(1)
        projekt.set_id(1)
        projekt.set_creation_date("2022-06-04 00:00:00.000")

        mapper.insert(projekt)