package server

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/md5"
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"io"
)

func createHash(key string) string {
	hasher := md5.New()
	hasher.Write([]byte(key))
	return hex.EncodeToString(hasher.Sum(nil))
}

func encrypt(data []byte, passphrase string) []byte {
	block, _ := aes.NewCipher([]byte(createHash(passphrase)))
	gcm, err := cipher.NewGCM(block)
	if err != nil {
		fmt.Println(err)
	}

	nonce := make([]byte, gcm.NonceSize())
	if _, err = io.ReadFull(rand.Reader, nonce); err != nil {
		fmt.Println(err)
	}
	ciphertext := gcm.Seal(nonce, nonce, data, nil)

	return ciphertext
}

func decrypt(data []byte, passphrase string) []byte {

	key := []byte(createHash(passphrase))
	block, err := aes.NewCipher(key)
	if err != nil {
		fmt.Println(err)
	}
	gcm, err := cipher.NewGCM(block)
	if err != nil {
		fmt.Println(err)
	}
	nonceSize := gcm.NonceSize()
	nonce, ciphertext := data[:nonceSize], data[nonceSize:]
	plaintext, err := gcm.Open(nil, nonce, ciphertext, nil)
	if err != nil {
		fmt.Println(err)
	}
	return plaintext
}

/*func encryptFile(filename string, data []byte, passphrase string) {
	f, _ := os.Create(filename)
	defer f.Close()
	f.Write(encrypt(data, passphrase))
}

func decryptFile(filename string, passphrase string) []byte {
	data, _ := ioutil.ReadFile(filename)
	return decrypt(data, passphrase)
}*/

/*func init() {

	fmt.Println("Starting the application...")

	ciphertext := encrypt([]byte("Hello World"), goDotEnvVariable("ENCRYPTION_KEY"))
	fmt.Printf("Encrypted: %x\n", ciphertext)

	plaintext := decrypt(ciphertext, goDotEnvVariable("ENCRYPTION_KEY"))
	fmt.Printf("Decrypted: %s\n", plaintext)

	/*encryptFile("sample.txt", []byte("Hello World"), "password1")
	fmt.Println(string(decryptFile("sample.txt", "password1")))
}*/
