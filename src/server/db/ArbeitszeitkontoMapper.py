from requests import delete
from server.bo.Arbeitszeitkonto import Arbeitszeitkonto
from server.db.Mapper import Mapper
from datetime import datetime, timedelta


class ArbeitszeitkontoMapper(Mapper):
    """Mapper-Klasse, die Konversation-Objekte auf eine relationale
    Datenbank abbildet. Hierzu wird eine Reihe von Methoden zur Verfügung
    gestellt, mit deren Hilfe z.B. Objekte gesucht, erzeugt, modifiziert und
    gelöscht werden können.
    """

    def __init__(self):
        super().__init__()

    def _rechne_urlaub(self, personID):
        zeiten = []
        cursor = self._cnx.cursor()
        command = "SELECT datum, startzeit, endzeit from ereignis WHERE type='urlaub' AND personID={}".format(personID)
        cursor.execute(command)
        zeiten = cursor.fetchall()
        dauert = timedelta(0)
        for (datum, startzeit, endzeit) in zeiten:
            begin_time = datetime.strptime(str(startzeit), "%H:%M:%S").time()
            end_time = datetime.strptime(str(endzeit), "%H:%M:%S").time()
            begin = datetime.combine(datum, begin_time)
            end = datetime.combine(datum, end_time)

            if end > begin:
                dauert += (end - begin)
            else:
                dauert += timedelta(0)

        cursor.close()
        return str(dauert)

    def _rechne_krankheit(self, personID):
        zeiten = []
        cursor = self._cnx.cursor()
        command = "SELECT datum, startzeit, endzeit from ereignis WHERE type='krankheit' AND personID={}".format(
            personID)
        cursor.execute(command)
        zeiten = cursor.fetchall()
        dauert = timedelta(0)
        for (datum, startzeit, endzeit) in zeiten:
            begin_time = datetime.strptime(str(startzeit), "%H:%M:%S").time()
            end_time = datetime.strptime(str(endzeit), "%H:%M:%S").time()
            begin = datetime.combine(datum, begin_time)
            end = datetime.combine(datum, end_time)

            if end > begin:
                dauert += (end - begin)
            else:
                dauert += timedelta(0)

        cursor.close()
        return str(dauert)

    def _rechne_pause(self, personID):
        zeiten = []
        cursor = self._cnx.cursor()
        command = "SELECT datum, startzeit, endzeit from ereignis WHERE type='pause' AND personID={}".format(personID)
        cursor.execute(command)
        zeiten = cursor.fetchall()
        dauert = timedelta(0)
        for (datum, startzeit, endzeit) in zeiten:
            begin_time = datetime.strptime(str(startzeit), "%H:%M:%S").time()
            end_time = datetime.strptime(str(endzeit), "%H:%M:%S").time()
            begin = datetime.combine(datum, begin_time)
            end = datetime.combine(datum, end_time)

            if end > begin:
                dauert += (end - begin)
            else:
                dauert += timedelta(0)

        cursor.close()
        return str(dauert)

    def _rechne_arbeit(self, personID):
        zeiten = []
        cursor = self._cnx.cursor()
        command = "SELECT datum, startzeit, endzeit from zeitintervall WHERE personID={}".format(personID)
        cursor.execute(command)
        zeiten = cursor.fetchall()
        dauert = timedelta(0)
        for (datum, startzeit, endzeit) in zeiten:
            begin_time = datetime.strptime(str(startzeit), "%H:%M:%S").time()
            end_time = datetime.strptime(str(endzeit), "%H:%M:%S").time()
            begin = datetime.combine(datum, begin_time)
            end = datetime.combine(datum, end_time)

            if end > begin:
                dauert += (end - begin)
            else:
                dauert += timedelta(0)

        cursor.close()
        return str(dauert)

    def _get_creation_date(self, key):
        result = ""
        cursor = self._cnx.cursor()
        command = "SELECT creation_date FROM person WHERE id={}".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()
        for (creation_date) in tuples:
            result = creation_date

        self._cnx.commit()
        cursor.close()
        return result

    def find_arbeitszeit_konto_by_key(self, key):
        konto = Arbeitszeitkonto()
        konto.set_id(key)
        # konto.set_creation_date(self._get_creation_date(key))
        konto.set_arbeit(self._rechne_arbeit(key))
        konto.set_pause(self._rechne_pause(key))
        konto.set_urlaub(self._rechne_urlaub(key))
        konto.set_krankheit(self._rechne_krankheit(key))

        return konto

    def find_all(self):
        return super().find_all()

    def find_by_key(self, id):
        return super().find_by_key(id)

    def insert(self):
        return super().insert()

    def update(self):
        return super().update()

    def delete(self):
        return super().delete()

    # Zum Testen ausführen


if (__name__ == "__main__"):
    with ArbeitszeitkontoMapper() as mapper:
        aktivitaet = Arbeitszeitkonto()
        aktivitaet.set_arbeit("48:55:00")
        aktivitaet.set_id(2)
        aktivitaet.set_creation_date("2022-06-10 00:00:00.0000")
        aktivitaet.set_urlaub("43:55:0")
        aktivitaet.set_krankheit("20:20:00")