#include<iostream>
#include<fstream>
#include<string.h>
#include<time.h>

using namespace std;

/**
 * Lunghezza massima dei valori who, what, why, e lunghezza massima della frase
 * numero di elementi che compongono una frase
 * Nome del file contenente i pezzi di frasi da attaccare
 * Nome del file contenente le frasi preferite
 */
const int lungwho=30, lungwhat=40, lungwhy=40, lungall=110;
const int numel=3;
const char FilePezzi[] = "ElencoPezzi.txt";
const char FilePreferiti[] = "FrasiPreferite.txt";

/**
 *  struttura usata per immagazzinare una terna di possibili valori
 *  un array di questo elemento contiene i vari pezzi ottenuti
 *  in input da un file
 */
struct pezzi
{
	char who[lungwho];
	char what[lungwhat];
	char why[lungwhy];
};

/**
 * struttura usata per immagazzinare una frase completa
 */
struct sfrasi
{
	char frase[lungall];
};

/**
 * Per prendere in Input FilePezzi, ed immagazzinarlo in un array di elementi di tipo "pezzi"
 */
pezzi* Riempimento(int &n)
{
	ifstream f(FilePezzi);
	f>>n;
	pezzi* elenco = new pezzi[n];
	for(int i=0;i<n;i++)
	{
		f>>elenco[i].who;
		f>>elenco[i].what;
		f>>elenco[i].why;
	}
	f.close();
	return elenco;
}

/**
 * Stampa un biscotto, mettendo gli spazi prima di ogni maiuscola per migliorare la leggibilita'
 * bisogna passargli un array contenente gli indici da vedere nell'array di pezzi
 */
void StampaBiscotto(pezzi* elenco,int indice[])
{
	cout<<elenco[indice[0]].who[0];//il primo resta maiuscolo
	for(unsigned int i=1;i<strlen(elenco[indice[0]].who);i++)
	{
		if(static_cast<int>(elenco[indice[0]].who[i])<=90&&static_cast<int>(elenco[indice[0]].who[i])>=65){
			cout<<" ";
			elenco[indice[0]].who[i]=elenco[indice[0]].who[i]+32;
		}
		cout<<elenco[indice[0]].who[i];
	}
	for(unsigned int i=0;i<strlen(elenco[indice[1]].what);i++)
	{
		if(static_cast<int>(elenco[indice[1]].what[i])<=90&&static_cast<int>(elenco[indice[1]].what[i])>=65){
			cout<<" ";
			elenco[indice[1]].what[i]=elenco[indice[1]].what[i]+32;
		}
		cout<<elenco[indice[1]].what[i];
	}
	for(unsigned int i=0;i<strlen(elenco[indice[2]].why);i++)
	{
		if(static_cast<int>(elenco[indice[2]].why[i])<=90&&static_cast<int>(elenco[indice[2]].why[i])>=65){
			cout<<" ";
			elenco[indice[2]].why[i]=elenco[indice[2]].why[i]+32;
		}
		cout<<elenco[indice[2]].why[i];
	}
}

/**
 * Crea un nuovo biscotto, di fatto inizializzando i valori di un array "indice" con il risultato
 * della funzione PaoloFox
 */
void NuovoBiscotto(pezzi* elenco,int indice[],int n)
{
	srand(time(NULL));
	for(int i=0;i<numel;i++)
	{
		indice[i]=(rand()%n);
	}
}


/**
 * main, con classica scelta tra varie opzioni gestita da uno switch
 */
int main()
{
	int n;
	pezzi* elenco=Riempimento(n);
	int* indice=new int[numel];
	NuovoBiscotto(elenco,indice,n);
	StampaBiscotto(elenco,indice);
}
